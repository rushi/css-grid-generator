import { Button, Slider } from "@radix-ui/themes";
import { GridConfig } from "../types";

interface ControlPanelProps {
    config: GridConfig;
    onReset: () => void;
    onConfigChange: (config: Partial<GridConfig>) => void;
}

const ControlPanel = ({ config, onConfigChange, onReset }: ControlPanelProps) => {
    console.log("Config", config);
    return (
        <div className="space-y-6 bg-white p-6">
            <h2 className="text-xl font-bold">Grid Configuration</h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-extra-dark-gray block text-sm font-bold">Columns: {config.columns}</label>
                    <Slider
                        value={[config.columns]}
                        size="2"
                        step={1}
                        max={12}
                        variant="classic"
                        onValueChange={(value) => onConfigChange({ columns: value[0] })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-extra-dark-gray block text-sm font-bold">Rows: {config.rows}</label>
                    <Slider
                        value={[config.rows]}
                        size="2"
                        step={1}
                        max={12}
                        variant="classic"
                        onValueChange={(value) => onConfigChange({ rows: value[0] })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-extra-dark-gray block text-sm font-bold">
                        Column Gap: {config.columnGap}px
                    </label>
                    <Slider
                        value={[config.columnGap]}
                        size="2"
                        step={1}
                        max={12}
                        variant="classic"
                        onValueChange={(value) => onConfigChange({ columnGap: value[0] })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-extra-dark-gray block text-sm font-bold">Row Gap: {config.rowGap}px</label>
                    <Slider
                        value={[config.rowGap]}
                        size="2"
                        step={1}
                        max={12}
                        variant="classic"
                        onValueChange={(value) => onConfigChange({ rowGap: value[0] })}
                    />
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="surface" onClick={onReset}>
                    Reset
                </Button>
            </div>
        </div>
    );
};

export { ControlPanel };
