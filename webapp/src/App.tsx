import './styles/style.css'
import './styles/layout.css'
import './styles/sidebar.css'
import './styles/search.css'
import './styles/cards.css'
import Sidebar from "./components/Sidebar.tsx";
import SearchBar from "./components/SearchBar.tsx";
import Filter from "./components/Filter.tsx";
import ResultsList from "./components/ResultsList.tsx";
import { useCardSearch } from "./hooks/useCardSearch";

const TIPOS = ["None", "Battlefields", "Gear", "Legend", "Runes", "Spell", "Unit"];

function App() {
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
                      <Filter options={TIPOS}/>
                      {loading && <p style={{ textAlign: "center" }}>Cargando cartas…</p>}
                      {!loading && error !== "" && <p style={{ textAlign: "center" }}>{error}</p>}
                      {!loading && error === "" && <ResultsList cards={cards} />}

                      {!loading && browsing && cards.length > 0 && (
                          <div className="pagination-row">
                              <button onClick={prevPage} disabled={isFirstOverall}>← Anterior</button>
                              <span>{currentSet} · Página {page} de {totalPages}</span>
                              <button onClick={nextPage} disabled={isLastOverall}>Siguiente →</button>
                          </div>
                      )}
                  </div>

              </div>

          </div>
      </div>
  );
}

export default App
