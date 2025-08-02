import { Button, Slider } from "@radix-ui/themes";
import { GridConfig } from "../types/index";

interface ControlPanelProps {
    config: GridConfig;
    onReset: () => void;
    onConfigChange: (config: Partial<GridConfig>) => void;
}

const ControlPanel = ({ config, onConfigChange, onReset }: ControlPanelProps) => {
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
    ...rest
}: {
    value: number;
    max?: number;
    onValueChange: (value: number) => void;
}) => {
    return (
        <Slider
            value={[value]}
            size="2"
            step={1}
            max={12}
            variant="surface"
            onValueChange={(value) => onValueChange(value[0])}
            {...rest}
        />
    );
};

export { ControlPanel };
