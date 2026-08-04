

type CostFilterProps = {
    label: string;
    values: number[];
    selected: number[];
    onChange: (selected: number[]) => void;
};

function CostFilter({ label, values, selected, onChange }: CostFilterProps) {
    const toggle = (val: number) => {
        onChange(
            selected.includes(val)
                ? selected.filter((v) => v !== val)
                : [...selected, val]
        );
    };

    const maxValue = Math.max(...values);

    return (
        <div className="cost-filter">
            <span className="filter-label">{label}</span>
            <div className="cost-filter-pills">
                {values.map((val) => (
                    <button
                        type="button"
                        key={val}
                        className={`cost-pill ${selected.includes(val) ? "active" : ""}`}
                        onClick={() => toggle(val)}
                    >
                        {val === maxValue ? `${val}+` : val}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CostFilter;