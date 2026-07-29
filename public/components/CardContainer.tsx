import { useState } from "react";
import type { Card as CardType } from "../types/card";
import { searchCards } from "../services/riftcodexService";
import Card from "./Card";
import "../assets/CardComponent.css";

interface CardContainerProps {
    onSelectCard: (id: string) => void;
}

function CardContainer({ onSelectCard }: CardContainerProps) {
    const [query, setQuery] = useState("");
    const [cards, setCards] = useState<CardType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function loadCards() {
        if (query.trim() === "") {
            setCards([]);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await searchCards(query);
            setCards(data);
        } catch (err) {
            setCards([]);
            setError("No se pudieron cargar las cartas");
        }

        setLoading(false);
    }

    return (
        <div>
            <div className="controls">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar cartas..."
                />
                <button onClick={loadCards}>Buscar</button>
            </div>

            {loading && <p>Cargando...</p>}
            {error !== "" && <p>{error}</p>}

            <div className="card-container">
                {cards.length === 0 && <p>No hay cartas</p>}

                {cards.map((card) => (
                    <Card key={card.id} card={card} onClick={() => onSelectCard(card.id)} />
                ))}
            </div>
        </div>
    );
}

export default CardContainer;