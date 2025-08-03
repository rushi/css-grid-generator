import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useCallback, useMemo } from "react";
import { CodeOutput } from "./components/CodeOutput";
import { ControlPanel } from "./components/ControlPanel";
import { Footer } from "./components/Footer";
import { GridContainer } from "./components/GridContainer";
import { useGridState } from "./hooks/useGridState";
import { generateCode } from "./utils/codeGenerator";

const App = () => {
    const { config, items, updateConfig, addItem, updateItem, deleteItem, resetGrid } = useGridState();

    const generatedCode = useMemo(() => {
        return generateCode(config, items);
    }, [config, items]);

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

            // Get the drop target position
            const dropData = over.data.current;

            // If dropped over another grid item, try to swap positions
            if (dropData?.type === "grid-item") {
                const targetItem = dropData.item;

                // Swap the positions of the two items
                updateItem(draggedItem.id, {
                    gridColumn: targetItem.gridColumn,
                    gridRow: targetItem.gridRow,
                });

                updateItem(targetItem.id, {
                    gridColumn: draggedItem.gridColumn,
                    gridRow: draggedItem.gridRow,
                });
            }
            // If dropped over the grid container, calculate new position with 40% overlap
            else if (over.id === "grid-container") {
                // Get the active item's current position
                const activeRect = active.rect.current.translated;
                if (!activeRect) {
                    return;
                }

                // Get mouse position relative to grid
                const gridElement = document.querySelector(".grid-overlay");
                if (!gridElement) {
                    return;
                }

                const rect = gridElement.getBoundingClientRect();

                // Calculate grid cell dimensions
                const cellWidth = rect.width / config.columns;
                const cellHeight = rect.height / config.rows;

                // Get the dragged item's bounds relative to the grid
                const itemLeft = activeRect.left - rect.left;
                const itemRight = activeRect.left + activeRect.width - rect.left;
                const itemTop = activeRect.top - rect.top;
                const itemBottom = activeRect.top + activeRect.height - rect.top;

                // Find the best drop cell based on 40% overlap threshold
                let bestCol = -1;
                let bestRow = -1;
                let maxOverlap = 0;

                for (let col = 1; col <= config.columns; col++) {
                    for (let row = 1; row <= config.rows; row++) {
                        const cellLeft = (col - 1) * cellWidth;
                        const cellRight = col * cellWidth;
                        const cellTop = (row - 1) * cellHeight;
                        const cellBottom = row * cellHeight;

                        // Calculate overlap area
                        const overlapLeft = Math.max(itemLeft, cellLeft);
                        const overlapRight = Math.min(itemRight, cellRight);
                        const overlapTop = Math.max(itemTop, cellTop);
                        const overlapBottom = Math.min(itemBottom, cellBottom);

                        // Check if there's any overlap
                        if (overlapLeft < overlapRight && overlapTop < overlapBottom) {
                            const overlapWidth = overlapRight - overlapLeft;
                            const overlapHeight = overlapBottom - overlapTop;
                            const overlapArea = overlapWidth * overlapHeight;
                            const cellArea = cellWidth * cellHeight;
                            const overlapPercentage = overlapArea / cellArea;

                            // If this cell has more than 40% overlap and is the best so far
                            if (overlapPercentage >= 0.4 && overlapPercentage > maxOverlap) {
                                maxOverlap = overlapPercentage;
                                bestCol = col;
                                bestRow = row;
                            }
                        }
                    }
                }

                // If we found a valid drop location
                if (bestCol === -1 || bestRow === -1) return;

                const newCol = bestCol;
                const newRow = bestRow;

                // Parse current item dimensions
                const [, currentColEnd] = draggedItem.gridColumn.split(" / ").map(Number);
                const [, currentRowEnd] = draggedItem.gridRow.split(" / ").map(Number);
                const [currentColStart] = draggedItem.gridColumn.split(" / ").map(Number);
                const [currentRowStart] = draggedItem.gridRow.split(" / ").map(Number);

                const colSpan = currentColEnd - currentColStart;
                const rowSpan = currentRowEnd - currentRowStart;

                // Calculate new end positions
                const newColEnd = newCol + colSpan;
                const newRowEnd = newRow + rowSpan;

                // Check bounds
                if (newCol >= 1 && newColEnd <= config.columns + 1 && newRow >= 1 && newRowEnd <= config.rows + 1) {
                    // Check for collisions with other items
                    const wouldCollide = items.some((otherItem) => {
                        if (otherItem.id === draggedItem.id) return false;

                        const [otherColStart, otherColEnd] = otherItem.gridColumn.split(" / ").map(Number);
                        const [otherRowStart, otherRowEnd] = otherItem.gridRow.split(" / ").map(Number);

                        const horizontalOverlap = newCol < otherColEnd && newColEnd > otherColStart;
                        const verticalOverlap = newRow < otherRowEnd && newRowEnd > otherRowStart;

                        return horizontalOverlap && verticalOverlap;
                    });

                    // Only update if no collision
                    if (!wouldCollide) {
                        updateItem(draggedItem.id, {
                            gridColumn: `${newCol} / ${newColEnd}`,
                            gridRow: `${newRow} / ${newRowEnd}`,
                        });
                    }
                }
            }
        },
        [config.columns, config.rows, items, updateItem],
    );

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="debug-screens min-h-screen">
                <header className="border-light-gray border-b">
                    <div className="mx-auto max-w-7xl px-4 py-4">
                        <h2>CSS Grid Generator</h2>
                        <p className="text-extra-dark-gray mt-2">
                            Create custom CSS grid layouts with drag, drop & resize. Generate code for Tailwind CSS or
                            standard CSS + HTML.
                        </p>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 pt-4">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-5">
                        <div className="lg:col-span-2">
                            <ControlPanel config={config} onConfigChange={updateConfig} onReset={resetGrid} />
                        </div>

                        <div className="lg:col-span-3">
                            <GridContainer
                                config={config}
                                items={items}
                                onAddItem={addItem}
                                onUpdateItem={updateItem}
                                onDeleteItem={deleteItem}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-5">
                        <div className="lg:col-span-2">&nbsp;</div>
                        <div className="lg:col-span-3">
                            <CodeOutput code={generatedCode} />
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </DndContext>
    );
};

export { App };
