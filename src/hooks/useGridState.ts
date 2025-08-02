import { useState } from "react";
import { GridConfig, GridItem, GridPosition } from "../types/index";
import { formatGridPosition, getRandomColor } from "../utils/gridHelpers";

const defaultConfig = {
    columns: 4,
    rows: 4,
    columnGap: 16,
    rowGap: 16,
    columnFr: [],
    rowFr: [],
};

export const useGridState = () => {
    const [config, setConfig] = useState<GridConfig>({ ...defaultConfig });
    const [items, setItems] = useState<GridItem[]>([]);

    const updateConfig = (newConfig: Partial<GridConfig>) => {
        setConfig((prev) => ({ ...prev, ...newConfig }));
    };

    const addItem = (position: GridPosition) => {
        const { gridColumn, gridRow } = formatGridPosition(position);
        const newItem: GridItem = {
            id: `item-${Date.now()}`,
            gridColumn,
            gridRow,
            content: `Item ${items.length + 1}`,
            backgroundColor: getRandomColor(),
        };

        setItems((prev) => [...prev, newItem]);
    };

    const updateItem = (itemId: string, updates: Partial<GridItem>) => {
        setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item)));
    };

    const deleteItem = (itemId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
    };

    const resetGrid = () => {
        setItems([]);
        setConfig(defaultConfig);
    };

    return {
        config,
        items,
        updateConfig,
        addItem,
        updateItem,
        deleteItem,
        resetGrid,
    };
};
