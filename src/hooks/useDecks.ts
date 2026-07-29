import { useEffect, useState } from "react";
import type { Card } from "../types/card";
import type { Decks } from "../types/collection";

const STORAGE_KEY = "riftfolio_decks_v1";

function loadDecks(): Decks {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }
  return JSON.parse(raw);
}

export function useDecks() {
  const [decks, setDecks] = useState<Decks>(loadDecks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  }, [decks]);

  function createDeck(): string {
    const id = "deck_" + Date.now();
    setDecks((prev) => ({
      ...prev,
      [id]: { id, name: "Nuevo mazo", cards: {}, cardCache: {} },
    }));
    return id;
  }

  function renameDeck(deckId: string, name: string) {
    setDecks((prev) => ({
      ...prev,
      [deckId]: { ...prev[deckId], name },
    }));
  }

  function deleteDeck(deckId: string) {
    setDecks((prev) => {
      const next = { ...prev };
      delete next[deckId];
      return next;
    });
  }

  function setCardQty(deckId: string, card: Card, qty: number) {
    setDecks((prev) => {
      const deck = prev[deckId];
      const nextCards = { ...deck.cards };
      const nextCache = { ...deck.cardCache };

      if (qty <= 0) {
        delete nextCards[card.id];
      } else {
        nextCards[card.id] = qty;
        nextCache[card.id] = card;
      }

      return {
        ...prev,
        [deckId]: { ...deck, cards: nextCards, cardCache: nextCache },
      };
    });
  }

  return { decks, createDeck, renameDeck, deleteDeck, setCardQty };
}
