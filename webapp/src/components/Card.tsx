import { ShoppingCart } from "lucide-react";
import { domainColor } from "../utils/domains.ts";

export interface CardProps {
    name: string;
    image: string;
    set: string;
    domain: string | string[];
    rarity: string;
    collectorNumber: string | number;
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function Card({ name, image, set, domain, rarity, collectorNumber }: CardProps) {
    const domains = Array.isArray(domain) ? domain : [domain];

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
                <div className="meta">
                    <span className="meta-left">
                        {domains.map((d) => (
                            <span
                                key={d}
                                className="color-dot"
                                style={{ background: domainColor(d) }}
                            />
                        ))}
                        {domains.map(capitalize).join(" / ")}
                    </span>
                    <span>{set}</span>
                </div>
                <div className="meta">
                    <span>{rarity}</span>
                    <span>#{collectorNumber}</span>
                </div>
            </div>
        </div>
    );
}

export default Card;