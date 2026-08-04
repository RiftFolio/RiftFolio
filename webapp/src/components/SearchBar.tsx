import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const debounceRef = useRef<number | undefined>(undefined);

    // SETS A TIMER SO THE API DOESN'T OVERLOAD
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setQuery(value);

        window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(() => {
            onSearch(value);
        }, 350);
    }

    return (
        <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input type="text"
                   value={query}
                   onChange={handleChange}
                   placeholder="Buscar..." />
        </div>
    );
}

export default SearchBar;