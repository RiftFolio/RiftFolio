import Card from "./Card.tsx";
import type { CardData } from "../utils/mapCard.ts";

interface ResultsListProps {
    cards: CardData[];
}

function ResultsList({ cards }: ResultsListProps) {
    return (
        <div className="card-grid">
            {cards.map((card) => (
                <Card
                    key={card.id}
                    name={card.name}
                    image={card.image}
                    domain={card.domain}
                    set={card.set}
                    rarity={card.rarity}
                    collectorNumber={card.collectorNumber}
                    orientation={card.orientation}
                />
            ))}
        </div>
    );
}

export default ResultsList;