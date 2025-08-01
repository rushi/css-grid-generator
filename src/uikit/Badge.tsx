import { Color, type ColorNames } from "./Standards";
import { cn } from "@/utils/classnames";

const badgeColors = {
    [Color.PRIMARY]: "bg-extra-light-primary text-primary",
    [Color.SECONDARY]: "bg-extra-light-secondary text-black",
    [Color.SUCCESS]: "bg-extra-light-success text-success",
    [Color.WARNING]: "bg-extra-light-warning text-warning",
    [Color.DANGER]: "bg-medium-light-danger text-danger",
    [Color.CAUTION]: "bg-extra-light-caution text-caution",
};

const sizes = {
    small: "px-1 py-[3.5px] h-5 text-sm leading-sm", // 20px
    medium: "px-3 py-1.5 h-7.5 text-base leading-base", // 30px
    large: "px-3.5 py-0.75 h-10 text-lg leading-lg", // 40px
};

interface BadgeProps {
    size?: keyof typeof sizes;
    color?: Color | ColorNames;
    children: React.ReactNode;
    className?: string;
}

export const Badge = ({ size = "small", color = Color.SECONDARY, children, className = "", ...rest }: BadgeProps) => {
    return (
        <div
            className={cn(
                "ui-badge",
                "tracking-tightest inline-flex min-w-4 items-center justify-between rounded",
                badgeColors[color],
                sizes[size],
                className,
            )}
            {...rest}
        >
            {children}
        </div>
    );
};
