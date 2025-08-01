import { Color, type ColorNames } from "./Standards";
import { cn } from "@/utils/classnames";

const colors: Record<Color, string> = {
    [Color.PRIMARY]: "bg-primary",
    [Color.SECONDARY]: "bg-secondary",
    [Color.SUCCESS]: "bg-success",
    [Color.WARNING]: "bg-warning",
    [Color.DANGER]: "bg-danger",
    [Color.CAUTION]: "bg-caution",
};

const sizes = {
    small: "h-1 w-1",
    medium: "h-1.5 w-1.5",
    large: "h-2 w-2",
};

interface DotProps {
    color?: Color | ColorNames;
    size?: keyof typeof sizes;
    className?: string;
}

export const Dot = ({ color = Color.PRIMARY, size = "medium", className, ...rest }: DotProps) => {
    return (
        <span
            data-testid={`dot-${color}-${size}`}
            className={cn(
                `ui-dot ui-dot-${color}`,
                "inline-block rounded-full text-white",
                colors[color],
                sizes[size],
                className,
            )}
            {...rest}
        />
    );
};
