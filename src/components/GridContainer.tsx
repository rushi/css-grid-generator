import { Button } from "@radix-ui/themes";
import { PlusIcon } from "@xola/icons";
import { useMemo } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { GridConfig, GridItem as GridItemType } from "../types/index";
import { GridItem } from "./GridItem";

const ResponsiveGridLayout = WidthProvider(Responsive);

const CELL_HEIGHT = 100;
const multiplier = 10; // To handle decimal fr/row values

interface GridContainerProps {
    config: GridConfig;
    items: GridItemType[];
    onAddItem: (x?: number, y?: number, w?: number, h?: number) => void;
    onUpdateItems: (items: GridItemType[]) => void;
    onDeleteItem: (itemId: string) => void;
}

const GridContainer = ({ config, items, onAddItem, onUpdateItems, onDeleteItem }: GridContainerProps) => {
    const { transformedItems, totalCols, totalRows } = useMemo(() => {
        const columnFr = config.columnFr.map(Number);
        let totalCols = config.columns;
        const frPositionsX = [0];
        let scaledFrX: number[] = [];
        if (columnFr.length > 0) {
            scaledFrX = columnFr.map((fr) => Math.round(fr * multiplier));
            totalCols = scaledFrX.reduce((sum, fr) => sum + fr, 0);
            for (let i = 0; i < scaledFrX.length - 1; i++) {
                frPositionsX.push(frPositionsX[i] + scaledFrX[i]);
            }
        }
        let totalRows = config.rows;
        const transformed = items.map((item) => {
            const newX = columnFr.length > 0 ? frPositionsX[item.x] : item.x;
            const newW = columnFr.length
                ? scaledFrX.slice(item.x, item.x + item.w).reduce((sum, fr) => sum + fr, 0)
                : item.w;
            const newY = item.y;
            const newH = item.h;
            return { ...item, x: newX, w: newW, y: newY, h: newH };
        });
        return { transformedItems: transformed, totalCols, totalRows };
    }, [items, config.columnFr, config.columns, config.rows]);

    const validateAndClampLayout = (layout: Layout[]) => {
        return layout.map((item) => ({
            ...item,
            x: Math.max(0, Math.min(item.x, totalCols - item.w)),
            y: Math.max(0, Math.min(item.y, totalRows - item.h)),
            w: Math.min(item.w, totalCols - item.x),
            h: Math.min(item.h, totalRows - item.y),
        }));
    };

    const handleLayoutChange = (layout: Layout[]) => {
        if (!config.columnFr.length) {
            const updatedItems = items.map((item) => {
                const layoutItem = layout.find((l) => l.i === item.i);
                if (layoutItem) {
                    return { ...item, x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h };
                }
                return item;
            });
            onUpdateItems(updatedItems);
            return;
        }
        const columnFr = config.columnFr.map(Number) || [];
        const multiplier = 10;
        const scaledFrX = columnFr.map((fr) => Math.round(fr * multiplier));
        const frPositionsX = [0];
        for (let i = 0; i < scaledFrX.length; i++) {
            frPositionsX.push(frPositionsX[i] + scaledFrX[i]);
        }
        const clampedLayout = validateAndClampLayout(layout);
        const updatedItems = items.map((originalItem) => {
            const layoutItem = clampedLayout.find((l) => l.i === originalItem.i);
            if (layoutItem) {
                let newX = layoutItem.x;
                let newW = layoutItem.w;
                if (columnFr.length > 0) {
                    const startColIndex = frPositionsX.findIndex((pos) => pos > layoutItem.x) - 1;
                    newX = Math.max(startColIndex, 0);
                    let accumulatedWidth = 0;
                    let colSpan = 1;
                    for (let i = newX; i < columnFr.length; i++) {
                        accumulatedWidth += scaledFrX[i];
                        if (accumulatedWidth >= layoutItem.w) {
                            colSpan = i - newX + 1;
                            break;
                        }
                    }
                    newW = colSpan;
                }
                let newY = layoutItem.y;
                let newH = layoutItem.h;
                return {
                    ...originalItem,
                    x: Math.max(0, newX),
                    y: Math.max(0, newY),
                    w: newW,
                    h: newH,
                };
            }
            return originalItem;
        });
        onUpdateItems(updatedItems);
    };

    const handleAddItem = () => {
        // Find an empty spot for the new item
        let x = 0;
        let y = 0;
        const w = 1;
        const h = 1;

        // Improved placement logic - find first available spot that fits within boundaries
        for (let row = 0; row <= config.rows - h; row++) {
            for (let col = 0; col <= config.columns - w; col++) {
                let canPlace = true;

                // Check if this position conflicts with existing items
                // Check if the current position (col, row) is free for a new item of size w x h
                for (let checkY = row; checkY < row + h && canPlace; checkY++) {
                    for (let checkX = col; checkX < col + w && canPlace; checkX++) {
                        // If any existing item overlaps with (checkX, checkY), mark as not placeable
                        const isOccupied = items.some((item) => {
                            return (
                                checkX >= item.x &&
                                checkX < item.x + item.w &&
                                checkY >= item.y &&
                                checkY < item.y + item.h
                            );
                        });
                        if (isOccupied) {
                            canPlace = false;
                        }
                    }
                }

                if (canPlace) {
                    x = col;
                    y = row;
                    onAddItem(x, y, w, h);
                    return;
                }
            }
        }

        // If no space found, try to place at the bottom with minimum size
        y = Math.max(0, Math.min(config.rows - 1, Math.max(...items.map((item) => item.y + item.h), 0)));
        if (y < config.rows - 1) {
            onAddItem(0, y, Math.min(w, config.columns), Math.min(h, config.rows - y));
        }
    };

    return (
        <div className="w-full py-6 lg:mx-auto lg:max-w-6xl">
            <div className="mb-4 flex space-x-4">
                <Button color="green" variant="surface" className="cursor-pointer!" onClick={handleAddItem}>
                    <PlusIcon />
                    Add Item
                </Button>
            </div>
            <div
                className="rounded"
                style={{ minHeight: `${config.rows * CELL_HEIGHT + (config.rows - 1) * config.rowGap + 32}px` }}
            >
                <div className="relative">
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            zIndex: 1,
                            opacity: 0.1,
                            display: "grid",
                            gridTemplateColumns:
                                config.columnFr.length > 0
                                    ? config.columnFr.map((fr) => `${fr}fr`).join(" ")
                                    : `repeat(${config.columns}, 1fr)`,
                            gridTemplateRows: `repeat(${config.rows}, ${CELL_HEIGHT}px)`,
                            gap: `${config.rowGap}px ${config.columnGap}px`,
                        }}
                    >
                        {Array.from({ length: config.rows }).map((_, rowIdx) => {
                            return Array.from({ length: config.columnFr.length || config.columns }).map((_, colIdx) => {
                                return (
                                    <div
                                        key={`cell-${rowIdx}-${colIdx}`}
                                        className="border border-dashed border-gray-300"
                                        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                                    />
                                );
                            });
                        })}
                    </div>
                    <ResponsiveGridLayout
                        className="layout"
                        layouts={{ lg: transformedItems }}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{
                            lg: totalCols,
                            md: totalCols,
                            sm: totalCols,
                            xs: totalCols,
                            xxs: totalCols,
                        }}
                        rowHeight={CELL_HEIGHT}
                        width={1200}
                        margin={[config.columnGap, config.rowGap]}
                        containerPadding={[0, 0]}
                        onLayoutChange={handleLayoutChange}
                        isDraggable={true}
                        isResizable={true}
                        preventCollision={config.preventCollision}
                        allowOverlap={config.allowOverlap}
                        compactType={config.compactType}
                        maxRows={totalRows}
                        isBounded={true}
                        useCSSTransforms={true}
                        autoSize={false}
                        verticalCompact={false}
                    >
                        {transformedItems.map((item) => (
                            <div key={item.i} data-grid={item}>
                                <GridItem item={item} onDelete={onDeleteItem} />
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                </div>
            </div>
        </div>
    );
};

export { GridContainer };
