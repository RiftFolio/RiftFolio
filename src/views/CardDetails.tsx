import { useEffect, useState } from "react";
import type { Card } from "../types/card";
import { getCardById } from "../services/riftcodexService";

interface CardDetailsProps {
  cardId: string;
  onBack: () => void;
}

function CardDetails({ cardId, onBack }: CardDetailsProps) {
  const [card, setCard] = useState<Card | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCard() {
      try {
        const data = await getCardById(cardId);
        setCard(data);
      } catch (err) {
        setError("No se pudo cargar la carta");
      }
    }

    loadCard();
  }, [cardId]);

  if (error !== "") {
    return (
      <div>
        <p>{error}</p>
        <button onClick={onBack}>Volver</button>
      </div>
    );
  }

  if (card === null) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <button onClick={onBack}>Volver</button>
      <img src={card.media.image_url} alt={card.media.accessibility_text} />
      <h2>{card.name}</h2>
      <p>{card.text.plain}</p>
    </div>
  );
}

export default CardDetails;
