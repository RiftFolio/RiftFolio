import type { Card as CardType } from "../types/card";
import "../assets/Card.css";

interface CardProps {
    card: CardType;
    onClick: () => void;
}

function Card({ card, onClick }: CardProps) {
    return (
        <div className="card" onClick={onClick}>
            <img src={card.media.image_url} alt={card.media.accessibility_text} />
            <p className="card-name">{card.name}</p>
            <p className="card-set">{card.set.label}</p>
        </div>
    );
}

export default Card;