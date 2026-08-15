import '../styles/layout.css'
import '../styles/sidebar.css'
import '../styles/search.css'
import Sidebar from "../components/Sidebar.tsx";
import SearchBar from "../components/SearchBar.tsx";
import FilterBox from "../components/FilterBox.tsx";
import ResultsList from "../components/ResultsList.tsx";
import { useCardSearch } from "../hooks/useCardSearch";
import type { FilterConfig } from "../types/filters";

const FILTERS: FilterConfig[] = [
    {
        type: "select",
        key: "type",
        label: "Type",
        options: ["None", "Battlefields", "Gear", "Legend", "Runes", "Spell", "Unit"],
    },
    {
        type: "select",
        key: "domain",
        label: "Domain",
        options: ["None", "Fury", "Calm", "Mind", "Body", "Order", "Chaos"],
    },
    {
        type: "select",
        key: "collection",
        label: "Collection",
        options: ["None", "Origins", "SpiritForged", "Unleashed", "Vendetta"],
    },
    {
        type: "cost",
        key: "cost",
        label: "Cost",
        values: [0, 1, 2, 3, 4, 5, 6, 7],
    },
];

function Home() {
    const {
        cards,
        loading,
        error,
        handleSearch,
        browsing,
        currentSet,
        page,
        totalPages,
        nextPage,
        prevPage,
        isFirstOverall,
        isLastOverall,
    } = useCardSearch();

    return (
        <div className="app-shell">
            <Sidebar />
            <div className="main-content">
                <div className="topbar">
                    <div className="search-bar-wrap">
                        <SearchBar onSearch={handleSearch} />
                        <FilterBox
                            filters={FILTERS}
                            onChange={(values) => console.log(values)}
                        />
                        {loading && <p style={{ textAlign: "center" }}>Loading cards…</p>}
                        {!loading && error !== "" && <p style={{ textAlign: "center" }}>{error}</p>}
                        {!loading && error === "" && <ResultsList cards={cards} />}

                        {!loading && browsing && cards.length > 0 && (
                            <div className="pagination-row">
                                <button onClick={prevPage} disabled={isFirstOverall}>← Previous</button>
                                <span>{currentSet} · Page {page} of {totalPages}</span>
                                <button onClick={nextPage} disabled={isLastOverall}>Next →</button>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Home