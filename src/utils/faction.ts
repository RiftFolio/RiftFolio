const DOMAIN_COLORS: Record<string, string> = {
  fury: "#e2543c",
  calm: "#3ea8d8",
  mind: "#a06be0",
  body: "#4caf6b",
  order: "#e8c368",
  chaos: "#8a8a95",
};

const DOMAIN_ORDER = ["fury", "calm", "mind", "body", "order", "chaos"];

export function domainColor(name: string): string {
  if (!name) {
    return "#6b6680";
  }

  const key = name.toLowerCase().trim();
  if (DOMAIN_COLORS[key]) {
    return DOMAIN_COLORS[key];
  }

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return "hsl(" + hue + ", 55%, 58%)";
}

export function domainRank(name: string): number {
  const key = name.toLowerCase().trim();
  const index = DOMAIN_ORDER.indexOf(key);
  return index === -1 ? DOMAIN_ORDER.length : index;
}