import type { RiftCard } from "../types/card";

export interface CardData {
    id: string | number;
    name: string;
    image: string;
    price: number;
    domain: string | string[];
    set: string;
    rarity: string;
    collectorNumber: string | number;
}

export function mapCard(card: RiftCard): CardData {
    const setLabel = card.set.set_id === "OPP" ? "Promo" : card.set.label;
    return {
        id: card.id,
        name: card.name,
        image: card.media.image_url,
        price: 0,
        domain: card.classification.domain,
        set: setLabel,
        rarity: card.classification.rarity,
        collectorNumber: card.collector_number,
    };
}