import { Layout } from "react-grid-layout";

export interface GridConfig {
    columns: number;
    rows: number;
    columnGap: number;
    rowGap: number;
    columnFr: number[];
    rowFr: number[];
    compactType?: "vertical" | "horizontal" | null;
    preventCollision?: boolean;
    allowOverlap?: boolean;
}

export interface GridItem {
    i: string; // react-grid-layout uses 'i' for id
    x: number; // column position (0-based)
    y: number; // row position (0-based)
    w: number; // width in grid units
    h: number; // height in grid units
    content: string;
    backgroundColor?: string;
    static?: boolean; // prevents dragging/resizing
    isDraggable?: boolean;
    isResizable?: boolean;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
}

export interface GridPosition {
    columnStart: number;
    columnEnd: number;
    rowStart: number;
    rowEnd: number;
}

export type ReactGridLayout = Layout[];

export interface CodeOutput {
    html: string;
    css: string;
    tailwind?: string;
}

export type CodeLanguage = "html" | "css" | "tailwind";
