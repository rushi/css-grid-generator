import { useState } from "react";
import { GridConfig, GridItem } from "../types/index";
import { getRandomColor } from "../utils/gridHelpers";

const defaultConfig: GridConfig = {
    columns: 12,
    rows: 12,
    columnGap: 16,
    rowGap: 16,
    columnFr: [],
    rowFr: [],
    compactType: "vertical",
    preventCollision: false,
    allowOverlap: false,
};

export const useGridState = () => {
    const [config, setConfig] = useState<GridConfig>({ ...defaultConfig });
    const [items, setItems] = useState<GridItem[]>([]);

    const updateConfig = (newConfig: Partial<GridConfig>) => {
        setConfig((prev) => ({ ...prev, ...newConfig }));
    };

    const addItem = (x = 0, y = 0, w = 2, h = 2) => {
        const newItem: GridItem = {
            i: `item-${Date.now()}`,
            x,
            y,
            w,
            h,
            content: `Item ${items.length + 1}`,
            backgroundColor: getRandomColor(),
            isDraggable: true,
            isResizable: true,
            minW: 1,
            minH: 1,
        };

        setItems((prev) => [...prev, newItem]);
    };

    const updateItems = (newItems: GridItem[]) => {
        setItems(newItems);
    };

    const updateItem = (itemId: string, updates: Partial<GridItem>) => {
        setItems((prev) => prev.map((item) => (item.i === itemId ? { ...item, ...updates } : item)));
    };

    const deleteItem = (itemId: string) => {
        setItems((prev) => prev.filter((item) => item.i !== itemId));
    };

    const resetGrid = () => {
        setItems([]);
        setConfig({ ...defaultConfig });
    };

    return {
        config,
        items,
        updateConfig,
        addItem,
        updateItems,
        updateItem,
        deleteItem,
        resetGrid,
    };
};
