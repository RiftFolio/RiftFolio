import './styles/style.css'
import './styles/layout.css'
import './styles/sidebar.css'
import './styles/topbar.css'
import './styles/cards.css'
import Sidebar from "./components/Sidebar.tsx";
import SearchBar from "./components/SearchBar.tsx";
import Filter from "./components/Filter.tsx";
import ResultsList from "./components/ResultsList.tsx";
import { mockData } from './assets/mock-data.ts';

const TIPOS = ["None", "Battlefields", "Gear", "Legend", "Runes", "Spell", "Unit"];

function App() {

    return (
        <div className="app-shell">
            <Sidebar />
            <div className="main-content">
                <div className="topbar">
                    <div className="search-bar-wrap">
                        <SearchBar />
                    </div>
                    <Filter options={TIPOS}/>
                </div>

                <ResultsList cards={mockData} />
            </div>
        </div>
    );
}

export default App;