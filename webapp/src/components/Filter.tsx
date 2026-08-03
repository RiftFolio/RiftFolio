import { useEffect, useRef, useState } from "react";
import "../styles/filter.css";

type FilterProps = {
    options: string[];
};

function Filter({ options }: FilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState<string | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleSelect = (tipo: string) => {
        setActive(tipo);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="filter" ref={wrapperRef}>
            <div className="filter-dropdown">
                <button
                    type="button"
                    className={`filter-toggle ${isOpen ? "open" : ""}`}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <span className="filter-toggle-text">
                        <span className="filter-label">Type</span>
                        <span className="filter-value">{active ?? "None"}</span>
                    </span>
                    <span className={`filter-arrow ${isOpen ? "open" : ""}`}>▾</span>
                </button>

                {isOpen && (
                    <ul className="filter-list">
                        {options.map((tipo) => (
                            <li
                                key={tipo}
                                className={`filter-item ${active === tipo ? "active" : ""}`}
                                onClick={() => handleSelect(tipo)}
                            >
                                {tipo}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Filter;