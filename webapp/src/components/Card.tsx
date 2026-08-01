import { ShoppingCart } from "lucide-react";

interface CardProps {
    name: string;
    image: string;
    price: number;
    set: string;
    domain: string;
}

function Card({ name, image, price, set, domain }: CardProps) {
    return (
        <div className="card">
            <div className="card-thumb">
                <img src={image} alt={name} />
                <div className="card-overlay">
                    <span className="add-icon">+</span>
                    <div className="buy-band">
                        <ShoppingCart className="buy-icon" />
                    </div>
                </div>
            </div>

            <div className="card-zoom">
                <img src={image} alt={name} />
            </div>

            <div className="info">
                <div className="name">{name}</div>
                <div className="meta">{domain} · {set}</div>
                <div className="meta">{price}€ </div>
            </div>
        </div>
    );
}

export default Card;