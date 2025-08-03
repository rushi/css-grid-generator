import { CodeOutput, GridConfig, GridItem } from "../types/index";
import { CodeOutput as CodeOutputComponent } from "./CodeOutput";
import { ControlPanel } from "./ControlPanel";
import { GridContainer } from "./GridContainer";

interface MainContentProps {
    config: GridConfig;
    items: GridItem[];
    generatedCode: CodeOutput;
    onConfigChange: (config: Partial<GridConfig>) => void;
    onReset: () => void;
    onAddItem: (x?: number, y?: number, w?: number, h?: number) => void;
    onUpdateItems: (items: GridItem[]) => void;
    onDeleteItem: (itemId: string) => void;
}

const MainContent = ({
    config,
    items,
    generatedCode,
    onConfigChange,
    onReset,
    onAddItem,
    onUpdateItems,
    onDeleteItem,
}: MainContentProps) => {
    return (
        <>
            {/* Control Panel and Grid */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-5">
                <div className="lg:col-span-2">
                    <ControlPanel config={config} onConfigChange={onConfigChange} onReset={onReset} />
                </div>

                <div className="lg:col-span-3">
                    <GridContainer
                        config={config}
                        items={items}
                        onAddItem={onAddItem}
                        onUpdateItems={onUpdateItems}
                        onDeleteItem={onDeleteItem}
                    />
                </div>
            </div>

            {/* Code Output */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-5">
                <div className="lg:col-span-2">&nbsp;</div>
                <div className="lg:col-span-3">
                    <CodeOutputComponent code={generatedCode} />
                </div>
            </div>
        </>
    );
};

export { MainContent };
