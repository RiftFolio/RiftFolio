import Card from "./Card.tsx";

interface CardData {
    id: string | number;
    name: string;
    image: string;
    price: number;
    domain: string | string[];
    set: string;
    rarity: string;
    collectorNumber: string | number;
}

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
                />
            ))}
        </div>
    );
}

export default ResultsList;