import { useEffect, useState } from "react";
import { getCardsByName, getCardsBySet } from "../services/riftcodexService";
import { mapCard } from "../utils/mapCard";
import type { CardData } from "../utils/mapCard";

const SET_ORDER = ["OGN", "OGS", "SFD", "UNL", "VEN"];
const PAGE_SIZE = 36;

export function useCardSearch() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [setIndex, setSetIndex] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [browsing, setBrowsing] = useState(true);

    async function loadBrowsePage(nextSetIndex: number, nextPage: number) {
        setLoading(true);
        setError("");
        setBrowsing(true);
        try {
            const setId = SET_ORDER[nextSetIndex];
            const data = await getCardsBySet(setId, nextPage, PAGE_SIZE);
            setCards(data.items.map(mapCard));
            setTotalPages(data.pages);
            setSetIndex(nextSetIndex);
            setPage(nextPage);
        } catch (err) {
            setCards([]);
            setError("No se pudo conectar con la API de RiftCodex");
        }
        setLoading(false);
    }

    async function handleSearch(query: string) {
        if (query.trim().length < 2) {
            loadBrowsePage(0, 1);
            return;
        }

        setLoading(true);
        setError("");
        setBrowsing(false);
        try {
            const data = await getCardsByName(query);
            setCards(data.map(mapCard));
        } catch (err) {
            setCards([]);
            setError("No se pudo conectar con la API de RiftCodex");
        }
        setLoading(false);
    }

    useEffect(() => {
        loadBrowsePage(0, 1);
    }, []);

    function nextPage() {
        if (page < totalPages) {
            loadBrowsePage(setIndex, page + 1);
            return;
        }
        if (setIndex < SET_ORDER.length - 1) {
            loadBrowsePage(setIndex + 1, 1);
        }
    }

    function prevPage() {
        if (page > 1) {
            loadBrowsePage(setIndex, page - 1);
            return;
        }
        if (setIndex > 0) {
            loadBrowsePage(setIndex - 1, 1);
        }
    }

    const isFirstOverall = setIndex === 0 && page === 1;
    const isLastOverall = setIndex === SET_ORDER.length - 1 && page >= totalPages;

    return {
        cards,
        loading,
        error,
        handleSearch,
        browsing,
        currentSet: SET_ORDER[setIndex],
        page,
        totalPages,
        nextPage,
        prevPage,
        isFirstOverall,
        isLastOverall,
    };
}