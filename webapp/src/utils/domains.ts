const DOMAIN_COLORS: Record<string, string> = {
    fury: "#e2543c",
    mind: "#3ea8d8",
    body: "#e0863c",
    chaos: "#a06be0",
    calm: "#4caf6b",
    order: "#e8c368",
    none: "#8a8a95",
};

const DOMAIN_ORDER = Object.keys(DOMAIN_COLORS);

export function domainColor(name: string): string {
    return DOMAIN_COLORS[name?.toLowerCase().trim()] || "#6b6680";
}

export function domainRank(name: string): number {
    const index = DOMAIN_ORDER.indexOf(name?.toLowerCase().trim());
    return index === -1 ? DOMAIN_ORDER.length : index;
}