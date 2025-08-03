import { DragEndEvent } from "@dnd-kit/core";
import { useCallback } from "react";
import { GridConfig, GridItem } from "../types/index";

interface UseDragAndDropProps {
    config: GridConfig;
    items: GridItem[];
    updateItem: (itemId: string, updates: Partial<GridItem>) => void;
}

export const useDragAndDrop = ({ config, items, updateItem }: UseDragAndDropProps) => {
    const handleItemSwap = useCallback(
        (draggedItem: GridItem, targetItem: GridItem) => {
            updateItem(draggedItem.id, { gridColumn: targetItem.gridColumn, gridRow: targetItem.gridRow });
            updateItem(targetItem.id, { gridColumn: draggedItem.gridColumn, gridRow: draggedItem.gridRow });
        },
        [updateItem],
    );

    const handleCellDrop = useCallback(
        (draggedItem: GridItem, row: number, col: number) => {
            const [currentColStart] = draggedItem.gridColumn.split(" / ").map(Number);
            const [, currentColEnd] = draggedItem.gridColumn.split(" / ").map(Number);
            const [currentRowStart] = draggedItem.gridRow.split(" / ").map(Number);
            const [, currentRowEnd] = draggedItem.gridRow.split(" / ").map(Number);

            const colSpan = currentColEnd - currentColStart;
            const rowSpan = currentRowEnd - currentRowStart;
            const newColEnd = col + colSpan;
            const newRowEnd = row + rowSpan;

            if (col >= 1 && newColEnd <= config.columns + 1 && row >= 1 && newRowEnd <= config.rows + 1) {
                const wouldCollide = items.some((otherItem) => {
                    if (otherItem.id === draggedItem.id) {
                        return false;
                    }

                    const [otherColStart, otherColEnd] = otherItem.gridColumn.split(" / ").map(Number);
                    const [otherRowStart, otherRowEnd] = otherItem.gridRow.split(" / ").map(Number);

                    const horizontalOverlap = col < otherColEnd && newColEnd > otherColStart;
                    const verticalOverlap = row < otherRowEnd && newRowEnd > otherRowStart;

                    return horizontalOverlap && verticalOverlap;
                });

                if (!wouldCollide) {
                    updateItem(draggedItem.id, {
                        gridColumn: `${col} / ${newColEnd}`,
                        gridRow: `${row} / ${newRowEnd}`,
                    });
                }
            }
        },
        [config.columns, config.rows, items, updateItem],
    );

    const handleContainerDrop = useCallback(
        (draggedItem: GridItem, activeRect: any) => {
            const gridElement = document.querySelector(".grid-overlay");
            if (!gridElement) {
                return;
            }

            const rect = gridElement.getBoundingClientRect();
            const cellWidth = rect.width / config.columns;
            const cellHeight = rect.height / config.rows;

            const itemLeft = activeRect.left - rect.left;
            const itemRight = activeRect.left + activeRect.width - rect.left;
            const itemTop = activeRect.top - rect.top;
            const itemBottom = activeRect.top + activeRect.height - rect.top;

            const centerX = (itemLeft + itemRight) / 2;
            const centerY = (itemTop + itemBottom) / 2;

            const bestCol = Math.max(1, Math.min(config.columns, Math.floor(centerX / cellWidth) + 1));
            const bestRow = Math.max(1, Math.min(config.rows, Math.floor(centerY / cellHeight) + 1));

            handleCellDrop(draggedItem, bestRow, bestCol);
        },
        [config.columns, config.rows, handleCellDrop],
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || !active.data.current) {
                return;
            }

            const draggedItem = active.data.current.item;
            if (!draggedItem) {
                return;
            }

            const dropData = over.data.current;
            if (dropData?.type === "grid-item") {
                const targetItem = dropData.item;
                handleItemSwap(draggedItem, targetItem);
            } else if (over.id?.toString().startsWith("cell-")) {
                if (dropData?.type === "grid-cell") {
                    const { row, col } = dropData;
                    handleCellDrop(draggedItem, row, col);
                }
            } else if (over.id === "grid-container") {
                const activeRect = active.rect.current.translated;
                if (activeRect) {
                    handleContainerDrop(draggedItem, activeRect);
                }
            }
        },
        [handleItemSwap, handleCellDrop, handleContainerDrop],
    );

    return { handleDragEnd };
};
