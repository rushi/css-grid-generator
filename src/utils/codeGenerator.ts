import { CodeOutput, GridConfig, GridItem } from "../types";

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
            (item, index) => `.grid-item-${index + 1} {
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

export const generateCode = (config: GridConfig, items: GridItem[]): CodeOutput => {
    return {
        html: generateHTML(items),
        css: generateCSS(config, items),
    };
};
