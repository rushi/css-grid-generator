import { range, sample } from "lodash-es";
import { GridConfig, GridPosition } from "../types/";

export const generateGridAreas = (config: GridConfig): string[][] => {
    return range(config.rows).map(() => range(config.columns).map(() => "."));
};

export const validateGridPosition = (position: GridPosition, config: GridConfig): boolean => {
    return (
        position.columnStart >= 1 &&
        position.columnEnd <= config.columns + 1 &&
        position.rowStart >= 1 &&
        position.rowEnd <= config.rows + 1
    );
};

export const parseGridPosition = (gridColumn: string, gridRow: string): GridPosition => {
    const [colStart, colEnd] = gridColumn.split(" / ").map(Number);
    const [rowStart, rowEnd] = gridRow.split(" / ").map(Number);

    return {
        columnStart: colStart,
        columnEnd: colEnd,
        rowStart: rowStart,
        rowEnd: rowEnd,
    };
};

export const formatGridPosition = (position: GridPosition): { gridColumn: string; gridRow: string } => {
    return {
        gridColumn: `${position.columnStart} / ${position.columnEnd}`,
        gridRow: `${position.rowStart} / ${position.rowEnd}`,
    };
};

export const getRandomColor = (() => {
    const colors = [
        "#1de9b6", // teal
        "#5dade2", // blue
        "#ffb74d", // orange
        "#ff6f61", // coral
        "#af7ac5", // purple
        "#58d68d", // green
        "#ffd54f", // yellow
        "#5faee3", // sky blue
        "#bb8fce", // lavender
        "#48c9b0", // aqua
        "#e57373", // light red
        "#f06292", // pink
        "#ba68c8", // violet
        "#81c784", // light green
        "#ffd700", // gold
    ];

    let used: Set<string> = new Set();
    return (): string => {
        // Reset used colors if all have been used
        if (used.size === colors.length) {
            used.clear();
        }

        // Pick a colors from the list that hasn't been used yet
        const selectedColor = sample(colors.filter((color) => !used.has(color)))!;
        used.add(selectedColor);
        return selectedColor;
    };
})();
