import { CircleCrossIcon } from "@xola/icons";
import React from "react";
import { GridItem as GridItemType } from "../types/index";
import { cn } from "@/utils/classnames";

interface GridItemProps {
    item: GridItemType;
    onDelete: (itemId: string) => void;
}

const GridItem = ({ item, onDelete }: GridItemProps) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onDelete(item.i);
    };

    return (
        <div
            className={cn(
                "relative flex h-full w-full flex-col items-center justify-center text-white",
                "cursor-move rounded border border-transparent hover:font-bold",
            )}
            style={{
                backgroundColor: item.backgroundColor,
                height: "100%",
                width: "100%",
            }}
        >
            <span className="text-center text-sm select-none">{item.content}</span>

            <span className="mt-1 text-xs opacity-75">
                {item.w} × {item.h}
            </span>

            <button
                onClick={handleDelete}
                onMouseDown={handleDelete}
                className="absolute top-1 right-1 z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white"
                title="Delete item"
            >
                <CircleCrossIcon size="small" className="text-white" />
            </button>
        </div>
    );
};

export { GridItem };
