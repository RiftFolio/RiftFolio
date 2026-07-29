import { useState } from "react";
import CardContainer from "../components/CardContainer";
import CardDetails from "./CardDetails";
import "../assets/MainPage.css";

function CardSearchView() {
    const [view, setView] = useState("search");
    const [selectedCardId, setSelectedCardId] = useState("");

    function openDetails(id: string) {
        setSelectedCardId(id);
        setView("details");
    }

    function backToSearch() {
        setView("search");
    }

    return (
        <div className="page">
            <main className="content">
                {view === "search" && <CardContainer onSelectCard={openDetails} />}
                {view === "details" && <CardDetails cardId={selectedCardId} onBack={backToSearch} />}
            </main>
        </div>
    );
}

export default CardSearchView;