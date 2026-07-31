import { useState } from "react";
import type { Card } from "./types/card";
import { useStock } from "./hooks/useStock";
import { useDecks } from "./hooks/useDecks";
import CardSearchView from "./views/CardSearchView";
import CollectionView from "./views/CollectionView";
import DecksView from "./views/DecksView";
import DeckBuilderView from "./views/DeckBuilderView";

type ViewName = "search" | "collection" | "decks";

function App() {
  const [view, setView] = useState<ViewName>("search");
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);

  const { stock, addCard, getQty } = useStock();
  const { decks, createDeck, renameDeck, deleteDeck, setCardQty } = useDecks();

  function goToView(nextView: ViewName) {
    setView(nextView);
    if (nextView !== "decks") {
      setActiveDeckId(null);
    }
  }

  function handleCreateDeck() {
    const id = createDeck();
    setActiveDeckId(id);
  }

  function handleDeleteDeck() {
    if (activeDeckId === null) {
      return;
    }
    deleteDeck(activeDeckId);
    setActiveDeckId(null);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="rune" />
          <div>
            <span>RiftFolio</span>
            <small>Riftbound TCG</small>
          </div>
        </div>

        <nav>
          <button className={view === "search" ? "active" : ""} onClick={() => goToView("search")}>
            Buscador
          </button>
          <button className={view === "collection" ? "active" : ""} onClick={() => goToView("collection")}>
            Mi colección
          </button>
          <button className={view === "decks" ? "active" : ""} onClick={() => goToView("decks")}>
            Mazos
          </button>
        </nav>
      </aside>

      <main id="main">
        {view === "search" && (
            <CardSearchView
                onAddToStock={(card: Card) => addCard(card, 1)}
                onRemoveFromStock={(card: Card) => addCard(card, -1)}
                getStockQty={getQty}
            />
        )}

        {view === "collection" && <CollectionView stock={stock} onChangeQty={addCard} />}

        {view === "decks" && activeDeckId === null && (
          <DecksView decks={decks} onCreateDeck={handleCreateDeck} onOpenDeck={setActiveDeckId} />
        )}

        {view === "decks" && activeDeckId !== null && decks[activeDeckId] && (
          <DeckBuilderView
            deck={decks[activeDeckId]}
            stock={stock}
            onBack={() => setActiveDeckId(null)}
            onRename={(name) => renameDeck(activeDeckId, name)}
            onDelete={handleDeleteDeck}
            onSetCardQty={(card, qty) => setCardQty(activeDeckId, card, qty)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
