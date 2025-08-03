import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useCallback, useMemo } from "react";
import { CodeOutput } from "./components/CodeOutput";
import { ControlPanel } from "./components/ControlPanel";
import { Footer } from "./components/Footer";
import { GridContainer } from "./components/GridContainer";
import { useGridState } from "./hooks/useGridState";
import { generateCode } from "./utils/codeGenerator";

const App = () => {
    const { config, items, updateConfig, addItem, updateItem, deleteItem, resetGrid } = useGridState();

    const generatedCode = useMemo(() => {
        return generateCode(config, items);
    }, [config, items]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || !active.data.current) return;

        const item = active.data.current.item;
        if (!item) return;

        // Simple drag handling - in a real app, you'd want more sophisticated logic
        console.log("Drag ended:", { active: active.id, over: over.id });
    }, []);

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="min-h-screen">
                <header className="border-light-gray border-b">
                    <div className="mx-auto max-w-7xl px-4 py-4">
                        <h2>CSS Grid Generator</h2>
                        <p className="text-extra-dark-gray mt-2">Create custom CSS grid layouts with drag & drop</p>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 pt-4">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-5">
                        <div className="lg:col-span-2">
                            <ControlPanel config={config} onConfigChange={updateConfig} onReset={resetGrid} />
                        </div>

                        <div className="lg:col-span-3">
                            <GridContainer
                                config={config}
                                items={items}
                                onAddItem={addItem}
                                onUpdateItem={updateItem}
                                onDeleteItem={deleteItem}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-5">
                        <div className="col-span-2">&nbsp;</div>
                        <div className="col-span-3">
                            <CodeOutput code={generatedCode} />
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </DndContext>
    );
};

export { App };
