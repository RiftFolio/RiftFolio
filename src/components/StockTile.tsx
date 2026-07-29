import type { Card } from "../types/card";
import { domainColor } from "../utils/faction";

interface StockTileProps {
  card: Card;
  qty: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

function StockTile({ card, qty, onIncrease, onDecrease }: StockTileProps) {
  const domain = card.classification.domain[0] || "Sin dominio";
  const color = domainColor(domain);

  return (
    <div className="card-tile">
      <div className="thumb">
        {card.media.image_url ? (
          <img src={card.media.image_url} alt={card.media.accessibility_text} loading="lazy" />
        ) : (
          <div className="noimg">{card.name}</div>
        )}
        <span className="qty-badge">x{qty}</span>
      </div>
      <div className="info">
        <div className="name">{card.name}</div>
        <div className="meta">
          <span>
            <span className="color-dot" style={{ background: color }} />
            {domain}
          </span>
          <span>{card.set.label}</span>
        </div>
        <div className="actions">
          <div className="stepper">
            <button onClick={onDecrease}>−</button>
            <span>{qty}</span>
            <button onClick={onIncrease}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockTile;
