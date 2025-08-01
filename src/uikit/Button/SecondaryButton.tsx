import { Color, Size, Variant } from "../Standards";
import { Button, type ButtonProps } from "./Button";
import { cn } from "@/utils/classnames";

interface SecondaryButtonProps extends ButtonProps {
    isLoading?: boolean;
}

export const SecondaryButton = ({
    type = "button",
    size = Size.MEDIUM,
    disabled = false,
    onClick,
    children,
    ...rest
}: SecondaryButtonProps) => (
    <Button
        type={type}
        size={size}
        disabled={disabled}
        color={Color.SECONDARY}
        variant={Variant.OUTLINE}
        className={cn(disabled ? "pointer-events-none" : "pointer-events-auto")}
        onClick={onClick}
        {...rest}
    >
        {children}
    </Button>
);
