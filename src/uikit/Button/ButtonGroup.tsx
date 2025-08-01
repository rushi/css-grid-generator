import React, { Children, cloneElement, type ButtonHTMLAttributes } from "react";
import { Size } from "../Standards";
import { cn } from "@/utils/classnames";

const sizes = {
    [Size.SMALL]: "px-2 py-1.5 text-sm",
    [Size.MEDIUM]: "py-2 px-2.5 text-base",
    [Size.LARGE]: "px-4 py-3.5 text-lg",
};

interface ButtonGroupProps {
    className?: string;
    size?: keyof typeof sizes;
    value: number;
    isCollapsed?: boolean;
    onChange: (index: number) => void;
    children: React.ReactNode;
}

const ButtonGroup = ({
    size = Size.MEDIUM,
    value,
    isCollapsed = false,
    onChange,
    className,
    children,
    ...rest
}: ButtonGroupProps) => {
    return (
        <span data-size={size} className={cn("ui-button-group", "inline-flex whitespace-nowrap", className)} {...rest}>
            {Children.map(children, (child, index) => {
                const buttonProps: any = { size };
                if (!React.isValidElement(child)) {
                    return null;
                }

                if (child.props.isHidden) {
                    return;
                }

                // Conditionally adding props like this so that we
                // are also able to control the props on `ButtonGroup.Button`
                // directly, if `value` and `onChange` are not passed on the parent.
                if (value !== undefined) {
                    buttonProps.isActive = value === index;
                }

                if (isCollapsed && value >= 0 && value !== index) {
                    buttonProps.shouldShowText = false;
                }

                if (onChange) {
                    buttonProps.onClick = () => onChange(index);
                }

                return cloneElement(child, buttonProps);
            })}
        </span>
    );
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    as?: string | React.ElementType;
    isActive?: boolean;
    shouldShowText?: boolean;
    isHidden?: boolean;
    size?: Size.SMALL | Size.MEDIUM | Size.LARGE;
    icon?: React.ReactElement;
    iconPlacement?: "left" | "right";
    className?: string;
    children: React.ReactNode;
}

const Button = ({
    isActive,
    shouldShowText = true,
    size = Size.MEDIUM,
    icon,
    iconPlacement = "left",
    className,
    children,
    ...rest
}: ButtonProps) => {
    const classes = cn(
        "ui-button-group-button",
        "inline-flex border-t border-l border-b last:border-r first:rounded-l-md last:rounded-r-md",
        "transition-colors focus:ring focus:ring-extra-light-blue disabled:opacity-60 focus:z-10 leading-none",
        sizes[size],
        isActive
            ? "bg-primary border border-extra-dark-blue text-white hover:bg-dark-blue"
            : "border-light-gray hover:bg-extra-light-lighter text-extra-dark-gray",
        className,
    );

    return (
        <button type="button" className={classes} {...rest}>
            {icon && iconPlacement === "left" ? <span className="mr-2 shrink-0">{icon}</span> : null}
            {/* Always show text if the icon isn't specified */}
            {shouldShowText ? children : icon ? null : children}
            {icon && iconPlacement === "right" ? <span className="ml-2 shrink-0">{icon}</span> : null}
        </button>
    );
};

Button.displayName = "ButtonGroup.Button";
ButtonGroup.Button = Button;

export { ButtonGroup };
