import type { Card } from "../types/card";
import type { Deck, Stock } from "../types/collection";

interface DeckBuilderViewProps {
  deck: Deck;
  stock: Stock;
  onBack: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  onSetCardQty: (card: Card, qty: number) => void;
}

function DeckBuilderView({ deck, stock, onBack, onRename, onDelete, onSetCardQty }: DeckBuilderViewProps) {
  const deckCardIds = Object.keys(deck.cards);
  const totalCount = Object.values(deck.cards).reduce((sum, qty) => sum + qty, 0);

  return (
    <div>
      <div className="back-link" onClick={onBack}>
        ← Volver a mazos
      </div>

      <div className="deck-header">
        <input type="text" value={deck.name} onChange={(e) => onRename(e.target.value)} />
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          Eliminar mazo
        </button>
      </div>

      <div className="deck-builder">
        <div>
          <h3>Cartas en el mazo ({totalCount})</h3>
          <div className="deck-list-rows">
            {deckCardIds.length === 0 && (
              <div className="empty-state">Aún no hay cartas en este mazo.</div>
            )}

            {deckCardIds.map((cardId) => {
              const card = deck.cardCache[cardId];
              const qty = deck.cards[cardId];
              return (
                <div key={cardId} className="deck-row">
                  <div style={{ flex: 1 }}>
                    <div className="rname">{card.name}</div>
                    <div className="rmeta">{card.set.label}</div>
                  </div>
                  <div className="stepper">
                    <button onClick={() => onSetCardQty(card, qty - 1)}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => onSetCardQty(card, qty + 1)}>+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="deck-side-panel">
            <h3>Añadir desde tu colección</h3>
            <div className="deck-list-rows">
              {Object.values(stock).map((entry) => {
                const inDeck = deck.cards[entry.card.id] || 0;
                return (
                  <div key={entry.card.id} className="deck-row">
                    <div style={{ flex: 1 }}>
                      <div className="rname">{entry.card.name}</div>
                      <div className="rmeta">
                        Posees {entry.qty} · En mazo {inDeck}
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => onSetCardQty(entry.card, inDeck + 1)}
                      disabled={inDeck >= entry.qty}
                    >
                      +
                    </button>
                  </div>
                );
              })}

              {Object.keys(stock).length === 0 && (
                <div className="empty-state">No tienes cartas en tu colección todavía.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckBuilderView;
