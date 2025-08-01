import { range, sample } from "lodash-es";
import { GridConfig, GridPosition } from "../types";

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

export const getRandomColor = (): string => {
    const colors = [
        "#1de9b6", // brighter teal
        "#5dade2", // brighter blue
        "#ffb74d", // brighter orange
        "#ff6f61", // brighter red
        "#af7ac5", // brighter purple
        "#58d68d", // brighter green
        "#ffd54f", // brighter yellow-orange
        "#5faee3", // brighter dark blue
        "#bb8fce", // brighter dark purple
        "#48c9b0", // brighter dark teal
    ];
    return sample(colors)!;
};
