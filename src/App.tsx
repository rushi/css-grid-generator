import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useCallback, useMemo } from "react";
import { CodeOutput } from "./components/CodeOutput";
import { ControlPanel } from "./components/ControlPanel";
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
            <div className="min-h-screen bg-white">
                <header className="border-b bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-6">
                        <h1 className="text-3xl font-bold">CSS Grid Generator</h1>
                        <p className="text-extra-dark-gray mt-2">Create custom CSS grid layouts with drag & drop</p>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Control Panel */}
                        <div className="lg:col-span-1">
                            <ControlPanel config={config} onConfigChange={updateConfig} onReset={resetGrid} />
                        </div>

                        {/* Grid Container */}
                        <div className="lg:col-span-2">
                            <GridContainer
                                config={config}
                                items={items}
                                onAddItem={addItem}
                                onUpdateItem={updateItem}
                                onDeleteItem={deleteItem}
                            />
                        </div>
                    </div>

                    {/* Code Output */}
                    <div className="mt-8 space-y-2 px-6">
                        <h3>Generated Code</h3>
                        <CodeOutput code={generatedCode} />
                    </div>
                </main>
            </div>
        </DndContext>
    );
};

export { App };
