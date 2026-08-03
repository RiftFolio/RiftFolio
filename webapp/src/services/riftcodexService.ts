import type { RiftCard } from "../types/card";

const BASE_URL = "https://api.riftcodex.com";

interface CardListResponse {
    items: RiftCard[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export async function getCardsByName(fuzzy: string): Promise<RiftCard[]> {
    const url = BASE_URL + "/cards/name?fuzzy=" + encodeURIComponent(fuzzy);

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Error al buscar carta por nombre: " + res.status);
    }

    const data: CardListResponse = await res.json();
    return data.items;
}

export async function getCardsBySet(setId: string, page: number, size: number): Promise<CardListResponse> {
    const url = BASE_URL
        + "/cards?set_id=" + encodeURIComponent(setId)
        + "&page=" + page
        + "&size=" + size
        + "&sort=collector_number&dir=1";

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Error al obtener cartas del set " + setId + ": " + res.status);
    }

    const data: CardListResponse = await res.json();
    return data;
}

export async function getDefaultCards(): Promise<RiftCard[]> {
    const url = BASE_URL + "/cards?page=1&size=36&sort=collector_number&dir=1";

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Error al obtener las cartas: " + res.status);
    }

    const data: CardListResponse = await res.json();
    return data.items;
}