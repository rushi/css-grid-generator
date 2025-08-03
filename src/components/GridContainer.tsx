import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { GridConfig, GridItem as GridItemType } from "../types/index";
import { GridItem } from "./GridItem";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface GridContainerProps {
    config: GridConfig;
    items: GridItemType[];
    onAddItem: (x?: number, y?: number, w?: number, h?: number) => void;
    onUpdateItems: (items: GridItemType[]) => void;
    onDeleteItem: (itemId: string) => void;
}

const GridContainer = ({ config, items, onAddItem, onUpdateItems, onDeleteItem }: GridContainerProps) => {
    const validateAndClampLayout = (layout: Layout[]) => {
        return layout.map((item) => ({
            ...item,
            x: Math.max(0, Math.min(item.x, config.columns - item.w)),
            y: Math.max(0, item.y),
            w: Math.min(item.w, config.columns - item.x),
            h: Math.min(item.h, config.rows - item.y),
        }));
    };

    const handleLayoutChange = (layout: Layout[]) => {
        const clampedLayout = validateAndClampLayout(layout);
        const updatedItems = items.map((item) => {
            const layoutItem = clampedLayout.find((l) => l.i === item.i);
            if (layoutItem) {
                return {
                    ...item,
                    x: layoutItem.x,
                    y: layoutItem.y,
                    w: layoutItem.w,
                    h: layoutItem.h,
                };
            }
            return item;
        });
        onUpdateItems(updatedItems);
    };

    const handleAddItem = () => {
        // Find an empty spot for the new item
        let x = 0;
        let y = 0;
        const w = 2;
        const h = 2;

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
            <div className="mb-4">
                <button onClick={handleAddItem} className="bg-blue hover:bg-dark-blue rounded px-4 py-2 text-white">
                    Add Item
                </button>
            </div>

            <div
                className="rounded"
                style={{
                    minHeight: `${config.rows * 80 + (config.rows - 1) * config.rowGap + 32}px`,
                }}
            >
                <div className="relative">
                    {/* Custom Grid Overlay to show the cells */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            zIndex: 1,
                            opacity: 0.2,
                            display: "grid",
                            gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
                            gridTemplateRows: `repeat(${config.rows}, 80px)`,
                            gap: `${config.rowGap}px ${config.columnGap}px`,
                        }}
                    >
                        {Array.from({ length: config.columns * config.rows }).map((_, index) => (
                            <div
                                key={index}
                                className="border border-dashed border-gray-300"
                                style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                            />
                        ))}
                    </div>

                    <ResponsiveGridLayout
                        className="layout"
                        layouts={{ lg: items }}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{
                            lg: config.columns,
                            md: config.columns,
                            sm: config.columns,
                            xs: config.columns,
                            xxs: config.columns,
                        }}
                        rowHeight={80}
                        width={1200}
                        margin={[config.columnGap, config.rowGap]}
                        containerPadding={[0, 0]}
                        onLayoutChange={handleLayoutChange}
                        isDraggable={true}
                        isResizable={true}
                        preventCollision={config.preventCollision}
                        allowOverlap={config.allowOverlap}
                        compactType={config.compactType}
                        maxRows={config.rows}
                        isBounded={true}
                        useCSSTransforms={true}
                        autoSize={false}
                        verticalCompact={false}
                    >
                        {items.map((item) => (
                            <div key={item.i} data-grid={item}>
                                <GridItem item={item} onDelete={onDeleteItem} />
                            </div>
                        ))}
                    </ResponsiveGridLayout>

                    {/* Empty state message */}
                    {items.length === 0 && (
                        <div
                            className="absolute inset-0 flex items-center justify-center border"
                            style={{
                                minHeight: `${config.rows * 80 + (config.rows - 1) * config.rowGap + 32}px`,
                                zIndex: 2,
                                background: "rgba(255,255,255,0.7)",
                            }}
                        >
                            <div className="text-extra-dark-gray text-center">
                                <p className="mb-2 text-lg">No items in the grid</p>
                                <p className="text-sm">Click "Add Item" to create your first grid item</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export { GridContainer };
