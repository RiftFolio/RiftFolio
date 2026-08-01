
import './styles/style.css'
import SearchBar from "./components/SearchBar.jsx";
import Header from "./components/Header.tsx";
import ResultsList from "./components/ResultsList.jsx";
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
