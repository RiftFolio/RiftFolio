import Card from "./Card.tsx";

function ResultsList({ cards }) {
    return (
        <div>
            {cards.map((card) => (
                <Card key={card.id} name={card.name} image={card.image} price={card.price} domain={card.domain} set={card.set} />
            ))}
        </div>
    );
}
export default ResultsList;