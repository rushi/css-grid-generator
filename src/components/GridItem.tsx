import { CircleCrossIcon } from "@xola/icons";
import React, { useCallback, useRef, useState } from "react";
import { GridConfig, GridItem as GridItemType } from "../types/index";
import { cn } from "@/utils/classnames";
import { lighten } from "@/utils/gridHelpers";

interface GridItemProps {
    item: GridItemType;
    gridConfig: GridConfig;
    allItems: GridItemType[];
    onUpdate: (itemId: string, updates: Partial<GridItemType>) => void;
    onDelete: (itemId: string) => void;
}

const GridItem = ({ item, gridConfig, allItems, onUpdate, onDelete }: GridItemProps) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);

    const parseGridPosition = useCallback(() => {
        const [colStart, colEnd] = item.gridColumn.split(" / ").map(Number);
        const [rowStart, rowEnd] = item.gridRow.split(" / ").map(Number);
        return { colStart, colEnd, rowStart, rowEnd };
    }, [item.gridColumn, item.gridRow]);

    const checkCollision = useCallback(
        (newColStart: number, newColEnd: number, newRowStart: number, newRowEnd: number) => {
            return allItems.some((otherItem) => {
                if (otherItem.id === item.id) {
                    // Skip checking against itself
                    return false;
                }

                const [otherColStart, otherColEnd] = otherItem.gridColumn.split(" / ").map(Number);
                const [otherRowStart, otherRowEnd] = otherItem.gridRow.split(" / ").map(Number);

                // Check if rectangles overlap
                const horizontalOverlap = newColStart < otherColEnd && newColEnd > otherColStart;
                const verticalOverlap = newRowStart < otherRowEnd && newRowEnd > otherRowStart;

                return horizontalOverlap && verticalOverlap;
            });
        },
        [allItems, item.id],
    );

    const handleResizeStart = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();

            const { colStart, colEnd, rowStart, rowEnd } = parseGridPosition();
            const initialColSpan = colEnd - colStart;
            const initialRowSpan = rowEnd - rowStart;

            const startData = {
                x: e.clientX,
                y: e.clientY,
                colSpan: initialColSpan,
                rowSpan: initialRowSpan,
                colStart,
                rowStart,
            };

            setIsResizing(true);

            const handleMouseMove = (e: MouseEvent) => {
                if (!itemRef.current) {
                    return;
                }

                const deltaX = e.clientX - startData.x;
                const deltaY = e.clientY - startData.y;

                // Calculate how many grid cells to span based on mouse movement
                // You can adjust these values based on your actual grid cell size
                const cellWidth = 120;
                const cellHeight = 120;

                const colSpanDelta = Math.round(deltaX / cellWidth);
                const rowSpanDelta = Math.round(deltaY / cellHeight);

                const newColSpan = Math.max(1, startData.colSpan + colSpanDelta);
                const newRowSpan = Math.max(1, startData.rowSpan + rowSpanDelta);

                // Ensure we don't exceed grid boundaries
                const maxColSpan = gridConfig.columns - startData.colStart + 1;
                const maxRowSpan = gridConfig.rows - startData.rowStart + 1;

                const finalColSpan = Math.min(newColSpan, maxColSpan);
                const finalRowSpan = Math.min(newRowSpan, maxRowSpan);

                const newColEnd = startData.colStart + finalColSpan;
                const newRowEnd = startData.rowStart + finalRowSpan;

                // Check for collisions before updating
                const wouldCollide = checkCollision(startData.colStart, newColEnd, startData.rowStart, newRowEnd);

                // Only update if no collision would occur
                if (!wouldCollide) {
                    onUpdate(item.id, {
                        gridColumn: `${startData.colStart} / ${newColEnd}`,
                        gridRow: `${startData.rowStart} / ${newRowEnd}`,
                        // Remove custom width/height when using grid spanning
                        width: undefined,
                        height: undefined,
                    });
                }
            };

            const handleMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        },
        [parseGridPosition, gridConfig.columns, gridConfig.rows, onUpdate, item.id],
    );

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onDelete(item.id);
    };

    const { colStart, colEnd, rowStart, rowEnd } = parseGridPosition();
    const colSpan = colEnd - colStart;
    const rowSpan = rowEnd - rowStart;

    return (
        <div
            ref={itemRef}
            style={{
                gridColumn: item.gridColumn,
                gridRow: item.gridRow,
                backgroundColor: item.backgroundColor,
                ...(item.width && { width: item.width }),
                ...(item.height && { height: item.height }),
            }}
            className={cn(
                "group grid-item relative flex min-h-20 flex-col items-center justify-center p-4 text-white",
                "rounded border border-transparent hover:font-bold",
                isResizing && "cursor-se-resize",
            )}
        >
            <span className="text-center select-none">{item.content}</span>

            {/* Show span info when resizing or hovering */}
            <span className="mt-1 text-xs opacity-75">
                {colSpan} × {rowSpan}
            </span>

            <button
                onClick={handleDelete}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute top-2 right-2 z-10 flex cursor-pointer items-center justify-center"
            >
                <CircleCrossIcon size="medium" className="hover:text-red!" />
            </button>

            {/* Resize handle with color adapted to cell background */}
            <div
                onMouseDown={handleResizeStart}
                onPointerDown={(e) => e.stopPropagation()}
                className="resize-handle absolute right-0 bottom-0 z-10 h-4 w-4 cursor-se-resize opacity-40 transition-opacity duration-200 group-hover:opacity-100"
                style={{
                    // Use a darker version of the background color for the handle
                    background: (() => {
                        const handleColor = lighten(item.backgroundColor ?? "#888", 0.8);
                        return `
                    linear-gradient(-45deg, transparent 0px, transparent 1.25px, ${handleColor} 1.25px, ${handleColor} 2.5px, transparent 2.5px, transparent 3.75px, ${handleColor} 3.75px, ${handleColor} 5px, transparent 5px, transparent 6.25px, ${handleColor} 6.25px, ${handleColor} 7.5px, transparent 7.5px),
                    linear-gradient(-45deg, transparent 2.5px, transparent 3.75px, ${handleColor} 3.75px, ${handleColor} 5px, transparent 5px, transparent 6.25px, ${handleColor} 6.25px, ${handleColor} 7.5px, transparent 7.5px),
                    linear-gradient(-45deg, transparent 5px, transparent 6.25px, ${handleColor} 6.25px, ${handleColor} 7.5px, transparent 7.5px)
                `;
                    })(),
                }}
            />
        </div>
    );
};

export { GridItem };
