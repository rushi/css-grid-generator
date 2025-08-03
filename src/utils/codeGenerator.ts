import { CodeOutput, GridConfig, GridItem } from "../types/index";

export const generateCSS = (config: GridConfig, items: GridItem[]): string => {
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
            const [colStart, colEnd] = item.gridColumn.split(" / ").map(Number);
            const [rowStart, rowEnd] = item.gridRow.split(" / ").map(Number);

            const colSpan = colEnd - colStart;
            const rowSpan = rowEnd - rowStart;

            // Calculate expected position if items are placed sequentially
            const expectedCol = (index % config.columns) + 1;
            const expectedRow = Math.floor(index / config.columns) + 1;

            // Only add positioning rules if:
            // 1. Item spans multiple cells, OR
            // 2. Item is not in its natural sequential position
            const needsPositioning = colSpan > 1 || rowSpan > 1 || colStart !== expectedCol || rowStart !== expectedRow;

            if (!needsPositioning) {
                return null;
            }

            return `.grid-item-${index + 1} {
  grid-column: ${item.gridColumn};
  grid-row: ${item.gridRow};
}`;
        })
        .filter(Boolean)
        .join("\n");

    return containerCSS + (itemsCSS ? itemsCSS : "");
};

export const generateHTML = (items: GridItem[]): string => {
    const itemsHTML = items
        .map((item, index) => `  <div class="grid-item-${index + 1}">${item.content}</div>`)
        .join("\n");

    return `<div class="grid-container">
${itemsHTML}
</div>`;
};

export const generateTailwindCSS = (config: GridConfig, items: GridItem[]): string => {
    const containerClasses = [
        "grid",
        config.columnFr && config.columnFr.length > 0
            ? `[grid-template-columns:${config.columnFr.map((fr: number) => `${fr}fr`).join("_")}]`
            : `grid-cols-${config.columns}`,
        config.rowFr && config.rowFr.length > 0
            ? `[grid-template-rows:${config.rowFr.map((fr: number) => `${fr}fr`).join("_")}]`
            : `grid-rows-${config.rows}`,
        config.columnGap > 0 || config.rowGap > 0
            ? `gap-${Math.round((config.columnGap + config.rowGap) / 2 / 4)}`
            : "",
    ]
        .filter(Boolean)
        .join(" ");

    const itemsClasses = items
        .map((item, index) => {
            const [colStart, colEnd] = item.gridColumn.split(" / ").map(Number);
            const [rowStart, rowEnd] = item.gridRow.split(" / ").map(Number);

            const colSpan = colEnd - colStart;
            const rowSpan = rowEnd - rowStart;

            // Calculate expected position if items are placed sequentially
            const expectedCol = (index % config.columns) + 1;
            const expectedRow = Math.floor(index / config.columns) + 1;

            // Only add positioning classes if:
            // 1. Item spans multiple cells, OR
            // 2. Item is not in its natural sequential position
            const needsPositioning = colSpan > 1 || rowSpan > 1 || colStart !== expectedCol || rowStart !== expectedRow;

            if (!needsPositioning) {
                return null;
            }

            const classes = [
                colSpan > 1 ? `col-span-${colSpan}` : "",
                rowSpan > 1 ? `row-span-${rowSpan}` : "",
                colStart !== expectedCol ? `col-start-${colStart}` : "",
                rowStart !== expectedRow ? `row-start-${rowStart}` : "",
            ]
                .filter(Boolean)
                .join(" ");

            return `.grid-item-${index + 1} {
    @apply ${classes};
}`;
        })
        .filter(Boolean)
        .join("\n");

    return `.grid-container {
    @apply ${containerClasses};
}${itemsClasses ? `\n\n${itemsClasses}` : ""}`;
};

export const generateCode = (config: GridConfig, items: GridItem[]): CodeOutput => {
    return {
        html: generateHTML(items),
        css: generateCSS(config, items),
        tailwind: generateTailwindCSS(config, items),
    };
};
