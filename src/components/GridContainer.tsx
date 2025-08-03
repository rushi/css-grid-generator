import { useDroppable } from "@dnd-kit/core";
import { range } from "lodash-es";
import { useMemo } from "react";
import { GridConfig, GridItem as GridItemType, GridPosition } from "../types/index";
import { AddButton } from "./AddButton";
import { GridItem } from "./GridItem";

interface GridContainerProps {
    config: GridConfig;
    items: GridItemType[];
    onAddItem: (position: GridPosition) => void;
    onUpdateItem: (itemId: string, updates: Partial<GridItemType>) => void;
    onDeleteItem: (itemId: string) => void;
}

const GridContainer = ({ config, items, onAddItem, onUpdateItem, onDeleteItem }: GridContainerProps) => {
    const { setNodeRef } = useDroppable({ id: "grid-container" });

    const gridCells = useMemo(() => {
        return range(1, config.rows + 1).flatMap((row) => {
            return range(1, config.columns + 1).map((col) => ({ row, col, key: `${row}-${col}` }));
        });
    }, [config.rows, config.columns]);

    const isOccupied = (row: number, col: number): boolean => {
        return items.some((item) => {
            const [colStart, colEnd] = item.gridColumn.split(" / ").map(Number);
            const [rowStart, rowEnd] = item.gridRow.split(" / ").map(Number);
            return col >= colStart && col < colEnd && row >= rowStart && row < rowEnd;
        });
    };

    const gridTemplateColumns = useMemo(() => {
        return config.columnFr && config.columnFr.length > 0
            ? config.columnFr.map((fr: number) => `${fr}fr`).join(" ")
            : `repeat(${config.columns}, 1fr)`;
    }, [config.columnFr, config.columns]);

    const gridTemplateRows = useMemo(() => {
        return config.rowFr && config.rowFr.length > 0
            ? config.rowFr.map((fr: number) => `${fr}fr`).join(" ")
            : `repeat(${config.rows}, 1fr)`;
    }, [config.rowFr, config.rows]);

    return (
        <div className="w-full py-6 lg:mx-auto lg:max-w-4xl">
            <div
                ref={setNodeRef}
                className="grid-overlay border-light-gray relative min-h-96 rounded border p-2"
                style={{
                    display: "grid",
                    gridTemplateColumns,
                    gridTemplateRows,
                    gap: `${config.rowGap}px ${config.columnGap}px`,
                    backgroundSize: `calc(100% / ${config.columns}) calc(100% / ${config.rows})`,
                }}
            >
                {/* Add buttons for empty cells */}
                {gridCells.map(({ row, col, key }) => {
                    if (isOccupied(row, col)) {
                        return null;
                    }

                    return <DroppableCell key={key} row={row} col={col} onAdd={onAddItem} />;
                })}

                {/* Grid items */}
                {items.map((item) => (
                    <GridItem
                        key={item.id}
                        item={item}
                        gridConfig={config}
                        allItems={items}
                        onUpdate={onUpdateItem}
                        onDelete={onDeleteItem}
                    />
                ))}
            </div>
        </div>
    );
};

interface DroppableCellProps {
    row: number;
    col: number;
    onAdd: (position: GridPosition) => void;
}

const DroppableCell = ({ row, col, onAdd }: DroppableCellProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `cell-${row}-${col}`,
        data: {
            type: "grid-cell",
            row,
            col,
        },
    });

    return (
        <div
            ref={setNodeRef}
            style={{ gridColumn: `${col} / ${col + 1}`, gridRow: `${row} / ${row + 1}` }}
            className={`ui-empty-grid-item p-0.25 ${isOver ? "border-blue-300 bg-blue-100" : ""}`}
        >
            <AddButton
                position={{
                    columnStart: col,
                    columnEnd: col + 1,
                    rowStart: row,
                    rowEnd: row + 1,
                }}
                onAdd={onAdd}
            />
        </div>
    );
};

export { GridContainer };
