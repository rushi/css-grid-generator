import { useDraggable } from "@dnd-kit/core";
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

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: item.id,
        data: {
            type: "grid-item",
            item,
        },
        disabled: isResizing,
    });

    const parseGridPosition = useCallback(() => {
        const [colStart, colEnd] = item.gridColumn.split(" / ").map(Number);
        const [rowStart, rowEnd] = item.gridRow.split(" / ").map(Number);
        return { colStart, colEnd, rowStart, rowEnd };
    }, [item.gridColumn, item.gridRow]);

    const checkCollision = useCallback(
        (newColStart: number, newColEnd: number, newRowStart: number, newRowEnd: number) => {
            return allItems.some((otherItem) => {
                if (otherItem.id === item.id) return false;

                const [otherColStart, otherColEnd] = otherItem.gridColumn.split(" / ").map(Number);
                const [otherRowStart, otherRowEnd] = otherItem.gridRow.split(" / ").map(Number);

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
                if (!itemRef.current) return;

                const deltaX = e.clientX - startData.x;
                const deltaY = e.clientY - startData.y;

                const cellWidth = 120;
                const cellHeight = 120;

                const colSpanDelta = Math.round(deltaX / cellWidth);
                const rowSpanDelta = Math.round(deltaY / cellHeight);

                const newColSpan = Math.max(1, startData.colSpan + colSpanDelta);
                const newRowSpan = Math.max(1, startData.rowSpan + rowSpanDelta);

                const maxColSpan = gridConfig.columns - startData.colStart + 1;
                const maxRowSpan = gridConfig.rows - startData.rowStart + 1;

                const finalColSpan = Math.min(newColSpan, maxColSpan);
                const finalRowSpan = Math.min(newRowSpan, maxRowSpan);

                const newColEnd = startData.colStart + finalColSpan;
                const newRowEnd = startData.rowStart + finalRowSpan;

                const wouldCollide = checkCollision(startData.colStart, newColEnd, startData.rowStart, newRowEnd);

                if (!wouldCollide) {
                    onUpdate(item.id, {
                        gridColumn: `${startData.colStart} / ${newColEnd}`,
                        gridRow: `${startData.rowStart} / ${newRowEnd}`,
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
        [parseGridPosition, gridConfig.columns, gridConfig.rows, onUpdate, item.id, checkCollision],
    );

    const handleDelete = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete(item.id);
        },
        [onDelete, item.id],
    );

    const { colStart, colEnd, rowStart, rowEnd } = parseGridPosition();
    const colSpan = colEnd - colStart;
    const rowSpan = rowEnd - rowStart;

    const showSpanInfo = isResizing || colSpan > 1 || rowSpan > 1;

    const style = transform
        ? {
              gridColumn: item.gridColumn,
              gridRow: item.gridRow,
              backgroundColor: item.backgroundColor,
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              ...(item.width && { width: item.width }),
              ...(item.height && { height: item.height }),
          }
        : {
              gridColumn: item.gridColumn,
              gridRow: item.gridRow,
              backgroundColor: item.backgroundColor,
              ...(item.width && { width: item.width }),
              ...(item.height && { height: item.height }),
          };

    return (
        <div
            ref={(node) => {
                setNodeRef(node);
                if (itemRef.current !== node) {
                    (itemRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                }
            }}
            style={style}
            className={cn(
                "group grid-item relative flex min-h-20 flex-col items-center justify-center p-4 text-white",
                "rounded border border-transparent hover:font-bold",
                isResizing && "cursor-se-resize",
                isDragging && "z-50 opacity-50",
            )}
            {...attributes}
            {...listeners}
        >
            <span className="text-center select-none">{item.content}</span>

            {showSpanInfo && (
                <span className="mt-1 text-xs opacity-75">
                    {colSpan} × {rowSpan}
                </span>
            )}

            <button
                onClick={handleDelete}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute top-2 right-2 z-10 flex cursor-pointer items-center justify-center"
            >
                <CircleCrossIcon size="medium" className="hover:text-red!" />
            </button>

            <div
                onMouseDown={handleResizeStart}
                onPointerDown={(e) => e.stopPropagation()}
                className="resize-handle absolute right-0 bottom-0 z-10 h-4 w-4 cursor-se-resize opacity-40 transition-opacity duration-200 group-hover:opacity-100"
                style={{
                    background: (() => {
                        const handleColor = lighten(item.backgroundColor ?? "#888", 0.8);
                        return `
                            linear-gradient(-45deg, transparent 0px, transparent 2px, ${handleColor} 2px, ${handleColor} 4px, transparent 4px, transparent 6px, ${handleColor} 6px, ${handleColor} 8px, transparent 8px, transparent 10px, ${handleColor} 10px, ${handleColor} 12px, transparent 12px),
                            linear-gradient(-45deg, transparent 4px, transparent 6px, ${handleColor} 6px, ${handleColor} 8px, transparent 8px, transparent 10px, ${handleColor} 10px, ${handleColor} 12px, transparent 12px),
                            linear-gradient(-45deg, transparent 8px, transparent 10px, ${handleColor} 10px, ${handleColor} 12px, transparent 12px)
                        `;
                    })(),
                }}
            />
        </div>
    );
};

export { GridItem };
