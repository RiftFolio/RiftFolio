import { useEffect, useRef, useState } from "react";
import type { Card } from "../types/card";
import { getCardsByName, getCardsBySet } from "../services/riftcodexService";
import { domainRank } from "../utils/faction";
import CardTile from "../components/CardTile";

const SET_ORDER = ["OGN", "SFD", "UNL", "VEN"];
const PAGE_SIZE = 36;

interface CardSearchViewProps {
  onAddToStock: (card: Card) => void;
  onRemoveFromStock: (card: Card) => void;
  getStockQty: (cardId: string) => number;
}

function sortByDomain(list: Card[]): Card[] {
  return [...list].sort((a, b) => {
    const domainA = domainRank(a.classification.domain[0] || "");
    const domainB = domainRank(b.classification.domain[0] || "");
    return domainA - domainB;
  });
}

function CardSearchView({ onAddToStock, onRemoveFromStock, getStockQty }: CardSearchViewProps) {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<number | undefined>(undefined);

  const [setIndex, setSetIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadBrowsePage(nextSetIndex: number, nextPage: number) {
    setLoading(true);
    setError("");

    try {
      const setId = SET_ORDER[nextSetIndex];
      const data = await getCardsBySet(setId, nextPage, PAGE_SIZE);
      setCards(sortByDomain(data.items));
      setTotalPages(data.pages);
      setSetIndex(nextSetIndex);
      setPage(nextPage);
    } catch (err) {
      setCards([]);
      setError("No se pudo conectar con la API de RiftCodex");
    }

    setLoading(false);
  }

  async function runSearch(value: string) {
    setLoading(true);
    setError("");

    try {
      const data = await getCardsByName(value);
      setCards(sortByDomain(data));
    } catch (err) {
      setCards([]);
      setError("No se pudo conectar con la API de RiftCodex");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadBrowsePage(0, 1);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      if (value.trim().length >= 2) {
        runSearch(value);
      } else {
        loadBrowsePage(0, 1);
      }
    }, 350);
  }

  const isBrowsing = query.trim().length < 2;

  function handleNextPage() {
    if (page < totalPages) {
      loadBrowsePage(setIndex, page + 1);
      return;
    }
    if (setIndex < SET_ORDER.length - 1) {
      loadBrowsePage(setIndex + 1, 1);
    }
  }

  function handlePrevPage() {
    if (page > 1) {
      loadBrowsePage(setIndex, page - 1);
      return;
    }
    if (setIndex > 0) {
      loadBrowsePage(setIndex - 1, 1);
    }
  }

  const isFirstOverall = setIndex === 0 && page === 1;
  const isLastOverall = setIndex === SET_ORDER.length - 1 && page >= totalPages;

  return (
      <div>
        <div className="view-title">
          <div>
            <h1>Buscador de cartas</h1>
            <p>Encuentra cualquier carta de Riftbound y añádela a tu colección.</p>
          </div>
        </div>

        <div className="search-bar">
          <input
              type="text"
              placeholder="Busca por nombre (ej. Jinx, Ashe, Ornn...)"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              autoComplete="off"
          />
        </div>

        <div style={{ marginTop: 20 }}>
          {loading && (
              <div className="loading">
                <div className="spin" /> Cargando cartas…
              </div>
          )}

          {!loading && error !== "" && (
              <div className="empty-state">
                <h3>No se pudo conectar con la API</h3>
                <p>{error}</p>
              </div>
          )}

          {!loading && error === "" && cards.length === 0 && (
              <div className="empty-state">
                <h3>Sin resultados</h3>
                <p>No se encontraron cartas para "{query}".</p>
              </div>
          )}

          {!loading && cards.length > 0 && (
              <div className="card-grid">
                {cards.map((card) => (
                    <CardTile
                        key={card.id}
                        card={card}
                        qty={getStockQty(card.id)}
                        actionLabel="+ Añadir"
                        onAction={() => onAddToStock(card)}
                        onRemove={() => onRemoveFromStock(card)}
                    />
                ))}
              </div>
          )}

          {!loading && isBrowsing && cards.length > 0 && (
              <div className="pagination-row">
                <button className="btn btn-ghost btn-sm" onClick={handlePrevPage} disabled={isFirstOverall}>
                  ← Anterior
                </button>
                <span className="pagination-label">
              {SET_ORDER[setIndex]} · Página {page} de {totalPages}
            </span>
                <button className="btn btn-ghost btn-sm" onClick={handleNextPage} disabled={isLastOverall}>
                  Siguiente →
                </button>
              </div>
          )}
        </div>
      </div>
  );
}

export default CardSearchView;