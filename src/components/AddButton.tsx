import { PlusIcon } from "@xola/icons";
import { GridPosition } from "../types";
import { Button } from "@/uikit";

interface AddButtonProps {
    position: GridPosition;
    onAdd: (position: GridPosition) => void;
}

const AddButton = ({ position, onAdd }: AddButtonProps) => {
    const handleClick = () => {
        onAdd(position);
    };

    return (
        <Button color="primary" size="small" onClick={handleClick}>
            <PlusIcon size="small" className="" />
        </Button>
    );
};

export { AddButton };
