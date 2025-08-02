import { Button } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { PlusIcon } from "@xola/icons";
import { GridPosition } from "../types";

interface AddButtonProps {
    position: GridPosition;
    onAdd: (position: GridPosition) => void;
}

const AddButton = ({ position, onAdd }: AddButtonProps) => {
    const handleClick = () => {
        onAdd(position);
    };

    return (
        <Button
            variant="soft"
            className="hover:bg-extra-light-blue! rounded-none! hover:cursor-pointer!"
            onClick={handleClick}
        >
            <PlusIcon size="small" />
        </Button>
    );
};

export { AddButton };
