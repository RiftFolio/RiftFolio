export interface Attributes {
    energy?: number;
    might?: number;
    power?: number;
}

export interface Classification {
    type: string;
    supertype?: string;
    rarity: string;
    domain: string[];
}

export interface CardText {
    rich: string;
    plain: string;
    flavour?: string;
}

export interface CardSet {
    set_id: string;
    label: string;
}

export interface Media {
    image_url: string;
    artist: string;
    accessibility_text: string;
}

export interface RiftCard {
    id: string;
    name: string;
    riftbound_id: string;
    tcgplayer_id: string;
    collector_number: number;
    attributes: Attributes;
    classification: Classification;
    text: CardText;
    set: CardSet;
    media: Media;
    tags: string[];
    orientation: string;
    new?: boolean;
}