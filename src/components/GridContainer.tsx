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
    const handleLayoutChange = (layout: Layout[]) => {
        const updatedItems = items.map((item) => {
            const layoutItem = layout.find((l) => l.i === item.i);
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

        // Simple placement logic - find first available spot
        while (items.some((item) => item.x === x && item.y === y)) {
            x += 1;
            if (x >= config.columns - w + 1) {
                x = 0;
                y += 1;
            }
        }

        onAddItem(x, y, w, h);
    };

    return (
        <div className="w-full py-6 lg:mx-auto lg:max-w-6xl">
            <div className="mb-4">
                <button
                    onClick={handleAddItem}
                    className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                    Add Item
                </button>
            </div>

            <div className="border-light-gray rounded border p-2">
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
                    rowHeight={60}
                    width={1200}
                    margin={[config.columnGap, config.rowGap]}
                    containerPadding={[0, 0]}
                    onLayoutChange={handleLayoutChange}
                    isDraggable={true}
                    isResizable={true}
                    preventCollision={config.preventCollision}
                    allowOverlap={config.allowOverlap}
                    compactType={config.compactType}
                >
                    {items.map((item) => (
                        <div key={item.i} data-grid={item}>
                            <GridItem item={item} onDelete={onDeleteItem} />
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};

export { GridContainer };
