import { useState } from 'react';
import {Search} from "lucide-react";
function SearchBar() {
    const [query, setSearch] = useState('');

    function handleChange(event){
        setSearch(event.target.value)
    }
    return (
        <div className="search-bar">
            <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Buscar..."
                />
            <button><Search size={16} /></button>
        </div>
    );
}

export default SearchBar;