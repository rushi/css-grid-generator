import { Button, Slider } from "@radix-ui/themes";
import { GridConfig } from "../types/index";

interface ControlPanelProps {
    config: GridConfig;
    onReset: () => void;
    onConfigChange: (config: Partial<GridConfig>) => void;
}

const ControlPanel = ({ config, onConfigChange, onReset }: ControlPanelProps) => {
    const handleColumnFrChange = (index: number, value: number) => {
        const newColumnFr = [...(config.columnFr || [])];
        // Ensure array has enough elements
        while (newColumnFr.length <= index) {
            newColumnFr.push(1);
        }
        newColumnFr[index] = value;
        onConfigChange({ columnFr: newColumnFr });
    };

    const handleRowFrChange = (index: number, value: number) => {
        const newRowFr = [...(config.rowFr || [])];
        // Ensure array has enough elements
        while (newRowFr.length <= index) {
            newRowFr.push(1);
        }
        newRowFr[index] = value;
        onConfigChange({ rowFr: newRowFr });
    };

    const toggleFrMode = (type: "column" | "row") => {
        if (type === "column") {
            const isEnabled = config.columnFr && config.columnFr.length > 0;
            onConfigChange({
                columnFr: isEnabled ? [] : Array(config.columns).fill(1),
            });
        } else {
            const isEnabled = config.rowFr && config.rowFr.length > 0;
            onConfigChange({
                rowFr: isEnabled ? [] : Array(config.rows).fill(1),
            });
        }
    };

    const isColumnFrEnabled = config.columnFr && config.columnFr.length > 0;
    const isRowFrEnabled = config.rowFr && config.rowFr.length > 0;

    return (
        <div className="space-y-6 bg-white lg:py-8">
            <div className="text-lg leading-4 font-bold">Grid Configuration</div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-extra-dark-gray block text-sm font-bold">Columns: {config.columns}</label>
                    <ValueSlider value={config.columns} onValueChange={(value) => onConfigChange({ columns: value })} />
                </div>

                <div className="space-y-2">
                    <label className="text-extra-dark-gray block text-sm font-bold">Rows: {config.rows}</label>
                    <ValueSlider value={config.rows} onValueChange={(value) => onConfigChange({ rows: value })} />
                </div>

                <div className="space-y-2">
                    <label className="text-extra-dark-gray block text-sm font-bold">
                        Column Gap: {config.columnGap}px
                    </label>
                    <ValueSlider
                        value={config.columnGap}
                        max={24}
                        onValueChange={(value) => onConfigChange({ columnGap: value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-extra-dark-gray block text-sm font-bold">Row Gap: {config.rowGap}px</label>
                    <ValueSlider
                        value={config.rowGap}
                        max={24}
                        onValueChange={(value) => onConfigChange({ rowGap: value })}
                    />
                </div>
            </div>

            {/* Column Fr Controls */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-extra-dark-gray block text-sm font-bold">Column Sizing (fr)</label>
                    <Button
                        variant={isColumnFrEnabled ? "solid" : "surface"}
                        size="1"
                        onClick={() => toggleFrMode("column")}
                    >
                        {isColumnFrEnabled ? "Custom" : "Auto"}
                    </Button>
                </div>
                {isColumnFrEnabled && (
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${config.columns}, 1fr)` }}>
                        {Array.from({ length: config.columns }, (_, i) => (
                            <div key={i} className="space-y-1">
                                <label className="text-xs text-gray-600">Col {i + 1}</label>
                                <ValueSlider
                                    value={config.columnFr?.[i] || 1}
                                    min={0.5}
                                    max={5}
                                    step={0.25}
                                    onValueChange={(value) => handleColumnFrChange(i, value)}
                                />
                                <div className="text-center text-xs">{config.columnFr?.[i] || 1}fr</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Row Fr Controls */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-extra-dark-gray block text-sm font-bold">Row Sizing (fr)</label>
                    <Button variant={isRowFrEnabled ? "solid" : "surface"} size="1" onClick={() => toggleFrMode("row")}>
                        {isRowFrEnabled ? "Custom" : "Auto"}
                    </Button>
                </div>
                {isRowFrEnabled && (
                    <div className="space-y-2">
                        {Array.from({ length: config.rows }, (_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <label className="w-12 text-xs text-gray-600">Row {i + 1}</label>
                                <div className="flex-1">
                                    <ValueSlider
                                        value={config.rowFr?.[i] || 1}
                                        min={0.5}
                                        max={5}
                                        step={0.25}
                                        onValueChange={(value) => handleRowFrChange(i, value)}
                                    />
                                </div>
                                <div className="w-8 text-right text-xs">{config.rowFr?.[i] || 1}fr</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <Button variant="surface" onClick={onReset}>
                    Reset
                </Button>
            </div>
        </div>
    );
};

const ValueSlider = ({
    value,
    onValueChange,
    min = 1,
    max = 12,
    step = 1,
    ...rest
}: {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onValueChange: (value: number) => void;
}) => {
    return (
        <Slider
            value={[value]}
            size="2"
            min={min}
            max={max}
            step={step}
            variant="surface"
            onValueChange={(value) => onValueChange(value[0])}
            {...rest}
        />
    );
};

export { ControlPanel };
