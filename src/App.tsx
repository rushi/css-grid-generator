import { useMemo } from "react";
import { Layout } from "./components/Layout";
import { MainContent } from "./components/MainContent";
import { useGridState } from "./hooks/useGridState";
import { generateCode } from "./utils/codeGenerator";

const App = () => {
    const { config, items, updateConfig, addItem, updateItems, deleteItem, resetGrid } = useGridState();
    const generatedCode = useMemo(() => generateCode(config, items), [config, items]);

    return (
        <Layout>
            <MainContent
                config={config}
                items={items}
                generatedCode={generatedCode}
                onConfigChange={updateConfig}
                onReset={resetGrid}
                onAddItem={addItem}
                onUpdateItems={updateItems}
                onDeleteItem={deleteItem}
            />
        </Layout>
    );
};

export { App };
