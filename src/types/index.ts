export interface GridConfig {
    columns: number;
    rows: number;
    columnGap: number;
    rowGap: number;
}

export interface GridItem {
    id: string;
    gridColumn: string;
    gridRow: string;
    content: string;
    width?: string;
    height?: string;
    backgroundColor?: string;
}

export interface GridPosition {
    columnStart: number;
    columnEnd: number;
    rowStart: number;
    rowEnd: number;
}

export interface CodeOutput {
    html: string;
    css: string;
    tailwind: string;
}

export type CodeLanguage = "html" | "css" | "tailwind";
