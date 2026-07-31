import type { Card } from "../types/card";
import { domainColor } from "../utils/faction";

interface CardTileProps {
  card: Card;
  qty?: number;
  actionLabel: string;
  onAction: () => void;
  actionDisabled?: boolean;
  onRemove?: () => void;
}

function CardTile({ card, qty = 0, actionLabel, onAction, actionDisabled = false, onRemove }: CardTileProps) {
  const domain = card.classification.domain[0] || "Sin dominio";
  const color = domainColor(domain);

  function handleClick() {
    if (!actionDisabled) {
      onAction();
    }
  }

  function handleRemoveClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  }

  return (
      <div
          className={"card-tile" + (actionDisabled ? " disabled" : "")}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          title={actionLabel}
      >
        {qty > 0 && (
            <span className="qty-badge">
          x{qty}
              {onRemove && <button onClick={handleRemoveClick} title="Quitar de la colección">−</button>}
        </span>
        )}

        <div className="card-main">
          <div className="thumb">
            {card.media.image_url ? (
                <img src={card.media.image_url} alt={card.media.accessibility_text} loading="lazy" />
            ) : (
                <div className="noimg">{card.name}</div>
            )}
          </div>
          <div className="add-plus">+</div>
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
          </div>
        </div>

        {card.media.image_url && (
            <div className="card-zoom-preview">
              <img src={card.media.image_url} alt="" />
            </div>
        )}
      </div>
  );
}

export default CardTile;