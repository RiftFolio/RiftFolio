export type SelectFilterConfig = {
    type: "select";
    key: string;
    label: string;
    options: string[];
};

export type CostFilterConfig = {
    type: "cost";
    key: string;
    label: string;
    values: number[]; // e.g. [0,1,2,3,4,5,6,7] where 7 means "7+"
};

export type FilterConfig = SelectFilterConfig | CostFilterConfig;

export type FilterValue = string | number[] | null;