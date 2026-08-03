
import './styles/style.css'
import SearchBar from "./components/SearchBar.tsx";
import Header from "./components/Header.tsx";
import ResultsList from "./components/ResultsList.tsx";
import { useCardSearch } from "./hooks/useCardSearch";

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
      <div>
        <Header />
        <SearchBar onSearch={handleSearch} />
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
  );
}

export default App
