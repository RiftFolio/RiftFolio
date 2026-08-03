import { Search } from "lucide-react";

function SearchBar() {
    return (
        <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Buscar..." />
        </div>
    );
}

export default SearchBar;