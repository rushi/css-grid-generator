import { Button } from "@radix-ui/themes";
import { Slider } from "radix-ui";
import { GridConfig } from "../types";

interface ControlPanelProps {
    config: GridConfig;
    onReset: () => void;
    onConfigChange: (config: Partial<GridConfig>) => void;
}

const ControlPanel = ({ config, onConfigChange, onReset }: ControlPanelProps) => {
    return (
        <div className="space-y-6 bg-white p-6">
            <h2 className="text-xl font-bold">Grid Configuration</h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-extra-dark-gray block text-sm font-bold">Columns: {config.columns}</label>
                    <Slider.Root
                        step={1}
                        max={12}
                        defaultValue={[config.columns]}
                        onValueChange={(value) => onConfigChange({ columns: value[0] })}
                        className="relative flex h-5 w-full touch-none items-center select-none"
                    >
                        <Slider.Track className="bg-light-gray/80 relative h-2 grow rounded-md">
                            <Slider.Range className="bg-blue absolute h-full rounded-full" />
                        </Slider.Track>
                        <Slider.Thumb className="border-light-gray block size-4 rounded-[10px] border bg-white focus:outline-none" />
                    </Slider.Root>
                </div>

                <div className="space-y-2">
                    <label className="text-extra-dark-gray block text-sm font-bold">Rows: {config.rows}</label>
                    <Slider.Root
                        step={1}
                        max={12}
                        defaultValue={[config.rows]}
                        onValueChange={(value) => onConfigChange({ rows: value[0] })}
                        className="relative flex h-5 w-full touch-none items-center select-none"
                    >
                        <Slider.Track className="bg-light-gray/80 relative h-2 grow rounded-md">
                            <Slider.Range className="bg-blue absolute h-full rounded-full" />
                        </Slider.Track>
                        <Slider.Thumb className="border-light-gray block size-4 rounded-[10px] border bg-white focus:outline-none" />
                    </Slider.Root>
                </div>

                <div className="space-y-2">
                    <label className="text-extra-dark-gray block text-sm font-bold">
                        Column Gap: {config.columnGap}px
                    </label>
                    <Slider.Root
                        step={1}
                        max={50}
                        defaultValue={[config.columnGap]}
                        onValueChange={(value) => onConfigChange({ columnGap: value[0] })}
                        className="relative flex h-5 w-full touch-none items-center select-none"
                    >
                        <Slider.Track className="bg-light-gray/80 relative h-2 grow rounded-md">
                            <Slider.Range className="bg-blue absolute h-full rounded-full" />
                        </Slider.Track>
                        <Slider.Thumb className="border-light-gray block size-4 rounded-[10px] border bg-white focus:outline-none" />
                    </Slider.Root>
                </div>

                <div className="space-y-2">
                    <label className="text-extra-dark-gray block text-sm font-bold">Row Gap: {config.rowGap}px</label>
                    <Slider.Root
                        step={1}
                        max={50}
                        defaultValue={[config.rowGap]}
                        onValueChange={(value) => onConfigChange({ rowGap: value[0] })}
                        className="relative flex h-5 w-full touch-none items-center select-none"
                    >
                        <Slider.Track className="bg-light-gray/80 relative h-2 grow rounded-md">
                            <Slider.Range className="bg-blue absolute h-full rounded-full" />
                        </Slider.Track>
                        <Slider.Thumb className="border-light-gray block size-4 rounded-[10px] border bg-white focus:outline-none" />
                    </Slider.Root>
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
