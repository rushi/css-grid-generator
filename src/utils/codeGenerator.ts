import { CodeOutput, GridConfig, GridItem } from "../types/index";

export const generateCSS = (config: GridConfig, items: GridItem[]) => {
    const columnTemplate =
        config.columnFr && config.columnFr.length > 0
            ? config.columnFr.map((fr: number) => `${fr}fr`).join(" ")
            : `repeat(${config.columns}, 1fr)`;

    const rowTemplate =
        config.rowFr && config.rowFr.length > 0
            ? config.rowFr.map((fr: number) => `${fr}fr`).join(" ")
            : `repeat(${config.rows}, 1fr)`;

    const containerCSS = `.grid-container {
  display: grid;
  grid-template-columns: ${columnTemplate};
  grid-template-rows: ${rowTemplate};
  gap: ${config.rowGap}px ${config.columnGap}px;
  width: 100%;
}\n\n`;

    const itemsCSS = items
        .map((item, index) => {
            const colStart = item.x + 1; // Convert from 0-based to 1-based
            const colEnd = item.x + item.w + 1;
            const rowStart = item.y + 1;
            const rowEnd = item.y + item.h + 1;

            // Calculate expected position if items are placed sequentially
            const expectedCol = (index % config.columns) + 1;
            const expectedRow = Math.floor(index / config.columns) + 1;

            // Only add positioning rules if:
            // 1. Item spans multiple cells, OR
            // 2. Item is not in its natural sequential position
            const needsPositioning = item.w > 1 || item.h > 1 || colStart !== expectedCol || rowStart !== expectedRow;

            if (!needsPositioning) {
                return null;
            }

            return `.grid-item-${index + 1} {
  grid-column: ${colStart} / ${colEnd};
  grid-row: ${rowStart} / ${rowEnd};
}`;
        })
        .filter(Boolean)
        .join("\n");

    return containerCSS + (itemsCSS ? itemsCSS : "");
};

export const generateHTML = (items: GridItem[]) => {
    const itemsHTML = items
        .map((item, index) => `  <div class="grid-item-${index + 1}">${item.content}</div>`)
        .join("\n");

    return `<div class="grid-container">
${itemsHTML}
</div>`;
};

const generateGapClasses = (config: GridConfig) => {
    const columnGapValue = Math.round(config.columnGap / 4);
    const rowGapValue = Math.round(config.rowGap / 4);

    if (config.columnGap > 0 && config.rowGap > 0 && config.columnGap === config.rowGap) {
        return [`gap-${columnGapValue}`];
    }

    const gapClasses = [];
    if (config.columnGap > 0) {
        gapClasses.push(`gap-x-${columnGapValue}`);
    }
    if (config.rowGap > 0) {
        gapClasses.push(`gap-y-${rowGapValue}`);
    }

    return gapClasses;
};

export const generateTailwindHTML = (config: GridConfig, items: GridItem[]) => {
    const containerClasses = [
        "grid",
        config.columnFr && config.columnFr.length > 0
            ? `[grid-template-columns:${config.columnFr.map((fr: number) => `${fr}fr`).join("_")}]`
            : `grid-cols-${config.columns}`,
        config.rowFr && config.rowFr.length > 0
            ? `[grid-template-rows:${config.rowFr.map((fr: number) => `${fr}fr`).join("_")}]`
            : `grid-rows-${config.rows}`,
        ...generateGapClasses(config),
    ]
        .filter(Boolean)
        .join(" ");

    const itemsHTML = items
        .map((item, index) => {
            const colStart = item.x + 1; // Convert from 0-based to 1-based
            const colEnd = item.x + item.w + 1;
            const rowStart = item.y + 1;
            const rowEnd = item.y + item.h + 1;

            const colSpan = item.w;
            const rowSpan = item.h;

            // Calculate expected position if items are placed sequentially
            const expectedCol = (index % config.columns) + 1;
            const expectedRow = Math.floor(index / config.columns) + 1;

            // Only add positioning classes if:
            // 1. Item spans multiple cells, OR
            // 2. Item is not in its natural sequential position
            const needsPositioning = colSpan > 1 || rowSpan > 1 || colStart !== expectedCol || rowStart !== expectedRow;

            if (!needsPositioning) {
                return `  <div>${item.content}</div>`;
            }

            const classes = [
                colSpan > 1 ? `col-span-${colSpan}` : "",
                rowSpan > 1 ? `row-span-${rowSpan}` : "",
                colStart !== expectedCol ? `col-start-${colStart}` : "",
                rowStart !== expectedRow ? `row-start-${rowStart}` : "",
            ]
                .filter(Boolean)
                .join(" ");

            return `  <div class="${classes}">${item.content}</div>`;
        })
        .join("\n");

    return `<div class="${containerClasses}">
${itemsHTML}
</div>`;
};

export const generateCode = (config: GridConfig, items: GridItem[]) => {
    return {
        html: generateHTML(items),
        css: generateCSS(config, items),
        tailwind: generateTailwindHTML(config, items),
    };
};
