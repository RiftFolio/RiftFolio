
import './styles/style.css'
import SearchBar from "./components/SearchBar.tsx";
import Header from "./components/Header.tsx";
import ResultsList from "./components/ResultsList.tsx";
import { mockData } from './assets/mock-data.ts';

function App() {

  return (
      <div>
        <Header />
        <SearchBar />
        <ResultsList cards={mockData} />
      </div>
  );
}

export default App
