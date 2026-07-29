import { useEffect, useState } from "react";
import type { Card } from "../types/card";
import type { Stock } from "../types/collection";

const STORAGE_KEY = "riftfolio_stock_v1";

function loadStock(): Stock {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }
  return JSON.parse(raw);
}

export function useStock() {
  const [stock, setStock] = useState<Stock>(loadStock);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stock));
  }, [stock]);

  function addCard(card: Card, delta: number) {
    setStock((prev) => {
      const existingQty = prev[card.id] ? prev[card.id].qty : 0;
      const nextQty = Math.max(0, existingQty + delta);

      const next = { ...prev };
      if (nextQty === 0) {
        delete next[card.id];
      } else {
        next[card.id] = { qty: nextQty, card };
      }
      return next;
    });
  }

  function getQty(cardId: string): number {
    return stock[cardId] ? stock[cardId].qty : 0;
  }

  return { stock, addCard, getQty };
}
