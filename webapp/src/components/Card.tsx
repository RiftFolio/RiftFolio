import { ShoppingCart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { domainColor } from "../utils/domains.ts";
import { useAuth } from "../context/AuthContext.tsx";

export interface CardProps {
    name: string;
    image: string;
    set: string;
    domain: string | string[];
    rarity: string;
    collectorNumber: string | number;
    orientation?: string;
    onAdd?: () => void;
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function Card({ name, image, set, domain, rarity, collectorNumber, orientation, onAdd }: CardProps) {
    const domains = Array.isArray(domain) ? domain : [domain];
    const isLandscape = orientation === "landscape";
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    function handleAddClick() {
        if (!user) {
            navigate("/login", { state: { from: location.pathname } });
            return;
        }
        onAdd?.();
    }

    return (
        <div className={"card" + (isLandscape ? " card-landscape" : "")}>
            <div className="card-thumb">
                <img src={image} alt={name} />
                <div className="card-overlay">
                    <span className="add-icon" onClick={handleAddClick}>+</span>
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