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
    orientation: string;
}

export function mapCard(card: RiftCard): CardData {
    return {
        id: card.id,
        name: card.name,
        image: card.media.image_url,
        price: 0,
        domain: card.classification.domain,
        set: card.set.label,
        rarity: card.classification.rarity,
        collectorNumber: card.collector_number,
        orientation: card.orientation,
    };
}