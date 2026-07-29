import type { Card } from "./card";

export interface StockEntry {
  qty: number;
  card: Card;
}

export type Stock = Record<string, StockEntry>;

export interface Deck {
  id: string;
  name: string;
  cards: Record<string, number>;
  cardCache: Record<string, Card>;
}

export type Decks = Record<string, Deck>;
