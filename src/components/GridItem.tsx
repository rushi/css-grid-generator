import { useDraggable } from "@dnd-kit/core";
import { CircleCrossIcon } from "@xola/icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { GridConfig, GridItem as GridItemType } from "../types";

interface GridItemProps {
    item: GridItemType;
    gridConfig: GridConfig;
    onUpdate: (itemId: string, updates: Partial<GridItemType>) => void;
    onDelete: (itemId: string) => void;
}

const GridItem = ({ item, gridConfig, onUpdate, onDelete }: GridItemProps) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: item.id,
        data: { type: "grid-item", item },
    });

    const style = useMemo(() => {
        return transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
    }, [transform]);

    const parseGridPosition = useCallback(() => {
        const [colStart, colEnd] = item.gridColumn.split(" / ").map(Number);
        const [rowStart, rowEnd] = item.gridRow.split(" / ").map(Number);
        return { colStart, colEnd, rowStart, rowEnd };
    }, [item.gridColumn, item.gridRow]);

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

                // Update the grid item
                onUpdate(item.id, {
                    gridColumn: `${startData.colStart} / ${newColEnd}`,
                    gridRow: `${startData.rowStart} / ${newRowEnd}`,
                    // Remove custom width/height when using grid spanning
                    width: undefined,
                    height: undefined,
                });
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

    const handleDelete = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete(item.id);
        },
        [onDelete, item.id],
    );

    const dragListeners = useMemo(() => {
        return {
            ...listeners,
            onPointerDown: (e: React.PointerEvent) => {
                // Don't start drag if clicking on delete button or resize handle
                const target = e.target as HTMLElement;
                if (target.closest(".delete-button") || target.closest(".resize-handle")) {
                    return;
                }
                listeners?.onPointerDown?.(e);
            },
        };
    }, [listeners]);

    const { colStart, colEnd, rowStart, rowEnd } = parseGridPosition();
    const colSpan = colEnd - colStart;
    const rowSpan = rowEnd - rowStart;

    const showSpanInfo = isResizing || colSpan > 1 || rowSpan > 1;

    return (
        <div
            ref={(node) => {
                setNodeRef(node);
                itemRef.current = node;
            }}
            style={{
                ...style,
                gridColumn: item.gridColumn,
                gridRow: item.gridRow,
                backgroundColor: item.backgroundColor,
                // Only use custom width/height if they exist, otherwise let grid handle it
                ...(item.width && { width: item.width }),
                ...(item.height && { height: item.height }),
            }}
            className={`group grid-item relative flex min-h-20 cursor-move flex-col items-center justify-center rounded border border-transparent p-4 font-bold text-white transition-all duration-200 hover:border-white/30 ${isDragging ? "z-50 opacity-50" : ""} ${isResizing ? "border-blue cursor-se-resize" : ""} `}
            {...dragListeners}
            {...attributes}
        >
            <span className="text-center select-none">{item.content}</span>

            {/* Show span info when resizing or hovering */}
            {showSpanInfo && (
                <span className="mt-1 text-xs opacity-75">
                    {colSpan} × {rowSpan}
                </span>
            )}

            {/* Delete button */}
            <button
                onClick={handleDelete}
                onPointerDown={(e) => e.stopPropagation()}
                className="delete-button bg-red hover:bg-red absolute top-2 right-2 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            >
                <CircleCrossIcon className="pointer-events-none h-3 w-3" />
            </button>

            {/* Resize handle with native browser style */}
            <div
                onMouseDown={handleResizeStart}
                onPointerDown={(e) => e.stopPropagation()}
                className="resize-handle absolute right-0 bottom-0 z-10 h-4 w-4 cursor-se-resize opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{
                    background: `
                        linear-gradient(-45deg, transparent 0px, transparent 2px, #666 2px, #666 4px, transparent 4px, transparent 6px, #666 6px, #666 8px, transparent 8px, transparent 10px, #666 10px, #666 12px, transparent 12px),
                        linear-gradient(-45deg, transparent 4px, transparent 6px, #666 6px, #666 8px, transparent 8px, transparent 10px, #666 10px, #666 12px, transparent 12px),
                        linear-gradient(-45deg, transparent 8px, transparent 10px, #666 10px, #666 12px, transparent 12px)
                    `,
                }}
            />
        </div>
    );
};

export { GridItem };
