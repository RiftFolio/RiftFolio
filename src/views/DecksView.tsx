import type { Decks, Deck } from "../types/collection";

interface DecksViewProps {
  decks: Decks;
  onCreateDeck: () => void;
  onOpenDeck: (deckId: string) => void;
}

function deckTotalCount(deck: Deck): number {
  return Object.values(deck.cards).reduce((sum, qty) => sum + qty, 0);
}

function DecksView({ decks, onCreateDeck, onOpenDeck }: DecksViewProps) {
  const deckList = Object.values(decks);

  return (
    <div>
      <div className="view-title">
        <div>
          <h1>Mazos</h1>
          <p>Organiza tus cartas en mazos de juego.</p>
        </div>
      </div>

      <div className="deck-list">
        {deckList.map((deck) => (
          <div key={deck.id} className="deck-card" onClick={() => onOpenDeck(deck.id)}>
            <div className="dname">{deck.name}</div>
            <div className="dmeta">
              {deckTotalCount(deck)} cartas · {Object.keys(deck.cards).length} únicas
            </div>
          </div>
        ))}
        <div className="new-deck-card" onClick={onCreateDeck}>
          + Nuevo mazo
        </div>
      </div>

      {deckList.length === 0 && (
        <div className="empty-state">
          <h3>Ningún mazo todavía</h3>
          <p>Crea uno y añade cartas desde tu colección.</p>
        </div>
      )}
    </div>
  );
}

export default DecksView;
