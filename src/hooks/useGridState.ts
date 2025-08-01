import { useCallback, useMemo, useState } from "react";
import { GridConfig, GridItem, GridPosition } from "../types";
import { formatGridPosition, getRandomColor } from "../utils/gridHelpers";

export const useGridState = () => {
    const defaultConfig = useMemo<GridConfig>(
        () => ({
            columns: 4,
            rows: 4,
            columnGap: 16,
            rowGap: 16,
        }),
        [],
    );

    const [config, setConfig] = useState<GridConfig>(defaultConfig);
    const [items, setItems] = useState<GridItem[]>([]);

    const updateConfig = useCallback((newConfig: Partial<GridConfig>) => {
        setConfig((prev) => ({ ...prev, ...newConfig }));
    }, []);

    const addItem = useCallback(
        (position: GridPosition) => {
            const { gridColumn, gridRow } = formatGridPosition(position);
            const newItem: GridItem = {
                id: `item-${Date.now()}`,
                gridColumn,
                gridRow,
                content: `Item ${items.length + 1}`,
                backgroundColor: getRandomColor(),
            };

            setItems((prev) => [...prev, newItem]);
        },
        [items.length],
    );

    const updateItem = useCallback((itemId: string, updates: Partial<GridItem>) => {
        setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item)));
    }, []);

    const deleteItem = useCallback((itemId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
    }, []);

    const resetGrid = useCallback(() => {
        setItems([]);
        setConfig(defaultConfig);
    }, [defaultConfig]);

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
