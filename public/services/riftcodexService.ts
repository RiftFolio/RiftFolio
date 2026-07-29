import type { Card } from "../types/card";

const BASE_URL = "https://api.riftcodex.com";

export async function searchCards(query: string, setId?: string): Promise<Card[]> {
    let url = BASE_URL + "/cards/search?query=" + encodeURIComponent(query);
    if (setId) {
        url = url + "&set_id=" + encodeURIComponent(setId);
    }

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Error al buscar cartas: " + res.status);
    }

    const data: Card[] = await res.json();
    return data;
}

export async function getCardById(id: string): Promise<Card> {
    const url = BASE_URL + "/cards/" + id;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Error al obtener la carta: " + res.status);
    }

    const data: Card = await res.json();
    return data;
}

export async function getCardsByName(fuzzy: string, setId?: string): Promise<Card[]> {
    let url = BASE_URL + "/cards/name?fuzzy=" + encodeURIComponent(fuzzy);
    if (setId) {
        url = url + "&set_id=" + encodeURIComponent(setId);
    }

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Error al buscar carta por nombre: " + res.status);
    }

    const data: Card[] = await res.json();
    return data;
}