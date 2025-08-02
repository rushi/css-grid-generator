import { CodeOutput, GridConfig, GridItem } from "../types/index";

export const generateCSS = (config: GridConfig, items: GridItem[]): string => {
    const containerCSS = `.grid-container {
  display: grid;
  grid-template-columns: repeat(${config.columns}, 1fr);
  grid-template-rows: repeat(${config.rows}, 1fr);
  gap: ${config.rowGap}px ${config.columnGap}px;
  width: 100%;
}`;

    const itemsCSS = items
        .map(
            (item, index) => `
.grid-item-${index + 1} {
  grid-column: ${item.gridColumn};
  grid-row: ${item.gridRow};
  display: flex;
  align-items: center;
  justify-content: center;
}`,
        )
        .join("");

    return containerCSS + itemsCSS;
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
        `grid-cols-${config.columns}`,
        `grid-rows-${config.rows}`,
        config.columnGap > 0 || config.rowGap > 0
            ? `gap-${Math.round((config.columnGap + config.rowGap) / 2 / 4)}`
            : "",
        "w-full",
    ]
        .filter(Boolean)
        .join(" ");

    const itemsClasses = items
        .map((item, index) => {
            const [colStart, colEnd] = item.gridColumn.split(" / ").map(Number);
            const [rowStart, rowEnd] = item.gridRow.split(" / ").map(Number);

            const colSpan = colEnd - colStart;
            const rowSpan = rowEnd - rowStart;

            const classes = [
                "flex items-center justify-center",
                colSpan > 1 ? `col-span-${colSpan}` : "",
                rowSpan > 1 ? `row-span-${rowSpan}` : "",
                colStart > 1 ? `col-start-${colStart}` : "",
                rowStart > 1 ? `row-start-${rowStart}` : "",
            ]
                .filter(Boolean)
                .join(" ");

            return `.grid-item-${index + 1} {
    @apply ${classes}; 
}`;
        })
        .join("\n");

    return `.grid-container {
    @apply ${containerClasses};
}

${itemsClasses}`;
};

export const generateCode = (config: GridConfig, items: GridItem[]): CodeOutput => {
    return {
        html: generateHTML(items),
        css: generateCSS(config, items),
        tailwind: generateTailwindCSS(config, items),
    };
};
