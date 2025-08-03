import { range, sample } from "lodash-es";
import { GridConfig, GridPosition } from "../types/";

export const generateGridAreas = (config: GridConfig) => {
    return range(config.rows).map(() => range(config.columns).map(() => "."));
};

export const validateGridPosition = (position: GridPosition, config: GridConfig) => {
    return (
        position.columnStart >= 1 &&
        position.columnEnd <= config.columns + 1 &&
        position.rowStart >= 1 &&
        position.rowEnd <= config.rows + 1
    );
};

export const parseGridPosition = (gridColumn: string, gridRow: string) => {
    const [colStart, colEnd] = gridColumn.split(" / ").map(Number);
    const [rowStart, rowEnd] = gridRow.split(" / ").map(Number);

    return {
        columnStart: colStart,
        columnEnd: colEnd,
        rowStart: rowStart,
        rowEnd: rowEnd,
    };
};

export const formatGridPosition = (position: GridPosition) => {
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
    return () => {
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

/**
 * Darkens a hex color by a given amount.
 * @param hex - The hex color string (e.g. "#ffcc00" or "#fc0").
 * @param amount - Amount to darken (0 to 1, default 0.2).
 * @returns The darkened color as an rgb string.
 */
export const darken = (hex: string, amount = 0.2) => {
    let c = hex.replace(/^#/, "");
    if (c.length === 3) {
        c = c
            .split("")
            .map((x) => x + x)
            .join("");
    }
    const num = parseInt(c, 16);
    const r = Math.max(0, Math.round(((num >> 16) & 0xff) * (1 - amount)));
    const g = Math.max(0, Math.round(((num >> 8) & 0xff) * (1 - amount)));
    const b = Math.max(0, Math.round((num & 0xff) * (1 - amount)));
    return `rgb(${r},${g},${b})`;
};

/**
 * Lightens a hex color by a given amount.
 * @param hex - The hex color string (e.g. "#ffcc00" or "#fc0").
 * @param amount - Amount to lighten (0 to 1, default 0.2).
 * @returns The lightened color as an rgb string.
 */
export const lighten = (hex: string, amount = 0.2) => {
    let c = hex.replace(/^#/, "");
    if (c.length === 3) {
        c = c
            .split("")
            .map((x) => x + x)
            .join("");
    }
    const num = parseInt(c, 16);
    const r = Math.min(255, Math.round(((num >> 16) & 0xff) + (255 - ((num >> 16) & 0xff)) * amount));
    const g = Math.min(255, Math.round(((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * amount));
    const b = Math.min(255, Math.round((num & 0xff) + (255 - (num & 0xff)) * amount));
    return `rgb(${r},${g},${b})`;
};
