import type { Card } from "../types/card";
import type { Stock } from "../types/collection";
import StockTile from "../components/StockTile";

interface CollectionViewProps {
  stock: Stock;
  onChangeQty: (card: Card, delta: number) => void;
}

function CollectionView({ stock, onChangeQty }: CollectionViewProps) {
  const entries = Object.values(stock);

  if (entries.length === 0) {
    return (
      <div>
        <div className="view-title">
          <div>
            <h1>Mi colección</h1>
            <p>Aún no has añadido cartas.</p>
          </div>
        </div>
        <div className="empty-state">
          <h3>Tu bóveda está vacía</h3>
          <p>Ve al Buscador y añade tus primeras cartas para empezar.</p>
        </div>
      </div>
    );
  }

  const totalCards = entries.reduce((sum, entry) => sum + entry.qty, 0);
  const uniqueCards = entries.length;

  return (
    <div>
      <div className="view-title">
        <div>
          <h1>Mi colección</h1>
          <p>Tu stock de cartas.</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="num">{totalCards}</div>
          <div className="lbl">Cartas totales</div>
        </div>
        <div className="stat-card">
          <div className="num">{uniqueCards}</div>
          <div className="lbl">Cartas únicas</div>
        </div>
      </div>

      <div className="card-grid">
        {entries.map((entry) => (
          <StockTile
            key={entry.card.id}
            card={entry.card}
            qty={entry.qty}
            onIncrease={() => onChangeQty(entry.card, 1)}
            onDecrease={() => onChangeQty(entry.card, -1)}
          />
        ))}
      </div>
    </div>
  );
}

export default CollectionView;
