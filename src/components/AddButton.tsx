import { PlusIcon } from "@xola/icons";
import { GridPosition } from "../types/index";
import { cn } from "@/utils/classnames";

interface AddButtonProps {
    position: GridPosition;
    onAdd: (position: GridPosition) => void;
}

const AddButton = ({ position, onAdd }: AddButtonProps) => {
    const handleClick = () => {
        onAdd(position);
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "group border-light-gray hover:bg-extra-light-blue m-0.5 box-border flex min-h-20 w-full",
                "hover:border-light-blue cursor-pointer items-center justify-center rounded border border-dashed",
            )}
            style={{
                maxWidth: "calc(100% - 4px)",
                maxHeight: "calc(100% - 4px)",
            }}
        >
            <PlusIcon />
        </button>
    );
};

export { AddButton };
