import { useRef, useState } from "react";
import type { Card } from "../types/card";
import { searchCards } from "../services/riftcodexService";
import CardTile from "../components/CardTile";

interface CardSearchViewProps {
  onAddToStock: (card: Card) => void;
  getStockQty: (cardId: string) => number;
}

function CardSearchView({ onAddToStock, getStockQty }: CardSearchViewProps) {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<number | undefined>(undefined);

  async function runSearch(value: string) {
    setLoading(true);
    setError("");

    try {
      const data = await searchCards(value);
      setCards(data);
    } catch (err) {
      setCards([]);
      setError("No se pudo conectar con la API de RiftCodex");
    }

    setLoading(false);
  }

  function handleChange(value: string) {
    setQuery(value);
    window.clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setCards([]);
      setError("");
      return;
    }

    debounceRef.current = window.setTimeout(() => {
      runSearch(value);
    }, 350);
  }

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
      <div className="search-hint">Escribe al menos 2 letras.</div>

      <div style={{ marginTop: 20 }}>
        {loading && (
          <div className="loading">
            <div className="spin" /> Buscando cartas…
          </div>
        )}

        {!loading && error !== "" && (
          <div className="empty-state">
            <h3>No se pudo conectar con la API</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && error === "" && query.trim().length < 2 && (
          <div className="empty-state">
            <h3>Empieza a escribir</h3>
            <p>Los resultados aparecerán aquí a medida que busques.</p>
          </div>
        )}

        {!loading && error === "" && query.trim().length >= 2 && cards.length === 0 && (
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CardSearchView;
