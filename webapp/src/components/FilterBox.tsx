import { useState } from "react";
import Filter from "./Filter";
import CostFilter from "./CostFilter";
import type { FilterConfig, FilterValue } from "../types/filters";


type FilterBoxProps = {
    filters: FilterConfig[];
    onChange?: (values: Record<string, FilterValue>) => void;
};

function FilterBox({ filters, onChange }: FilterBoxProps) {
    const [values, setValues] = useState<Record<string, FilterValue>>(() =>
        Object.fromEntries(
            filters.map((f) => [f.key, f.type === "cost" ? [] : null])
        )
    );

    const handleChange = (key: string, value: FilterValue) => {
        setValues((prev) => {
            const next = { ...prev, [key]: value };
            onChange?.(next);
            return next;
        });
    };

    return (
        <div className="filter-box">
            {filters.map((f) => {
                if (f.type === "cost") {
                    return (
                        <CostFilter
                            key={f.key}
                            label={f.label}
                            values={f.values}
                            selected={(values[f.key] as number[]) ?? []}
                            onChange={(v) => handleChange(f.key, v)}
                        />
                    );
                }
                return (
                    <Filter
                        key={f.key}
                        label={f.label}
                        options={f.options}
                        value={values[f.key] as string | null}
                        onChange={(v) => handleChange(f.key, v)}
                    />
                );
            })}
        </div>
    );
}

export default FilterBox;