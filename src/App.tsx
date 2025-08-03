import { DndContext } from "@dnd-kit/core";
import { useMemo } from "react";
import { Footer } from "./components/Footer";
import { Layout } from "./components/Layout";
import { MainContent } from "./components/MainContent";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useGridState } from "./hooks/useGridState";
import { generateCode } from "./utils/codeGenerator";

const App = () => {
    const { config, items, updateConfig, addItem, updateItem, deleteItem, resetGrid } = useGridState();
    const { handleDragEnd } = useDragAndDrop({ config, items, updateItem });
    const generatedCode = useMemo(() => generateCode(config, items), [config, items]);

    return (
        <Layout>
            <DndContext onDragEnd={handleDragEnd}>
                <MainContent
                    config={config}
                    items={items}
                    generatedCode={generatedCode}
                    onConfigChange={updateConfig}
                    onReset={resetGrid}
                    onAddItem={addItem}
                    onUpdateItem={updateItem}
                    onDeleteItem={deleteItem}
                />
            </DndContext>
            <Footer />
        </Layout>
    );
};

export { App };
