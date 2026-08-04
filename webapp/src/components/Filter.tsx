import { useEffect, useRef, useState } from "react";
import "../styles/filter.css";

type FilterProps = {
    label: string;
    options: string[];
    value: string | null;
    onChange: (value: string | null) => void;
};

function Filter({ label, options, value, onChange }: FilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleSelect = (opt: string) => {
        onChange(opt);
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
                        <span className="filter-label">{label}</span>
                        <span className="filter-value">{value ?? "None"}</span>
                    </span>
                    <span className={`filter-arrow ${isOpen ? "open" : ""}`}>▾</span>
                </button>

                {isOpen && (
                    <ul className="filter-list">
                        {options.map((opt) => (
                            <li
                                key={opt}
                                className={`filter-item ${value === opt ? "active" : ""}`}
                                onClick={() => handleSelect(opt)}
                            >
                                {opt}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Filter;