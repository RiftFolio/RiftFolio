import type { Card } from "../types/card";
import { domainColor } from "../utils/faction";

interface CardTileProps {
  card: Card;
  qty?: number;
  actionLabel: string;
  onAction: () => void;
  actionDisabled?: boolean;
}

function CardTile({ card, qty = 0, actionLabel, onAction, actionDisabled = false }: CardTileProps) {
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
        {qty > 0 && <span className="qty-badge">x{qty}</span>}
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
        <div className="meta">
          <span>{card.classification.rarity}</span>
          <span>#{card.collector_number}</span>
        </div>
        <div className="actions">
          <button className="btn btn-gold btn-full btn-sm" onClick={onAction} disabled={actionDisabled}>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardTile;
