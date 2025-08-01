import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import type { Except } from "type-fest";
import { Color, Size, Variant, type ColorNames, type SizeNames, type VariantNames } from "../Standards";
import { cn } from "@/utils/classnames";

const buttonVariants = cva("", {
    variants: {
        variant: {
            standard: "border-transparent text-white",
            outline: "border bg-white hover:bg-white active:text-extra-dark-gray",
            link: "border-none border-transparent hover:underline",
            ghost: "border-red",
        },
        size: {
            tiny: "p-2 py-0.5 text-xs leading-xs", // 20px
            small: "h-7.5 px-3 py-2 text-sm leading-sm", // 30px
            medium: "h-10 px-4.5 py-3 text-base leading-base", // 40px
            large: "h-[50px] px-6 py-4 text-md leading-md", // 50px
        },
        [Color.PRIMARY]: {
            [Variant.STANDARD]: `bg-primary hover:bg-extra-dark-primary active:bg-primary`,
            [Variant.OUTLINE]: `border-primary text-primary hover:border-primary-dark hover:text-dark-primary active:bg-primary-light`,
            [Variant.LINK]: `text-primary focus:ring-0 focus:ring-offset-0`,
        },
        [Color.SECONDARY]: {
            [Variant.STANDARD]: `bg-secondary hover:bg-extra-dark-secondary active:bg-secondary`,
            [Variant.OUTLINE]: `border-secondary text-black hover:border-secondary-dark active:bg-secondary-light`,
            [Variant.LINK]: `text-secondary focus:ring-0 focus:ring-offset-0`,
        },
        [Color.SUCCESS]: {
            [Variant.STANDARD]: `bg-success hover:bg-extra-dark-success active:bg-success`,
            [Variant.OUTLINE]: `border-success text-success hover:border-success-dark hover:text-dark-success active:bg-success-light`,
            [Variant.LINK]: `text-success focus:ring-0 focus:ring-offset-0`,
        },
        [Color.DANGER]: {
            [Variant.STANDARD]: `bg-danger hover:bg-extra-dark-danger active:bg-danger`,
            [Variant.OUTLINE]: `border-danger text-danger hover:border-danger-dark hover:text-dark-danger active:bg-danger-light`,
            [Variant.LINK]: `text-danger focus:ring-0 focus:ring-offset-0`,
        },
        [Color.WARNING]: {
            [Variant.STANDARD]: `bg-warning hover:bg-extra-dark-warning active:bg-warning`,
            [Variant.OUTLINE]: `border-warning text-warning hover:border-warning-dark hover:text-dark-warning active:bg-warning-light`,
            [Variant.LINK]: `text-warning focus:ring-0 focus:ring-offset-0`,
        },
        [Color.CAUTION]: {
            [Variant.STANDARD]: `bg-caution hover:bg-extra-dark-caution active:bg-caution`,
            [Variant.OUTLINE]: `border-caution text-caution hover:border-caution-dark hover:text-dark-caution active:bg-caution-light`,
            [Variant.LINK]: `text-caution focus:ring-0 focus:ring-offset-0`,
        },
    },
});

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    size?: Size | SizeNames;
    color?: Color | ColorNames;
    variant?: Variant | VariantNames;
    className?: string;
    children: ReactNode;
}

export const Button = ({
    size = Size.MEDIUM,
    color = Color.PRIMARY,
    variant = Variant.STANDARD,
    className,
    children,
    ...rest
}: ButtonProps) => {
    return (
        <button
            type="button"
            className={cn(
                `ui-button ui-button-${color} ui-button-${variant}`,
                "inline-flex items-center justify-center rounded border font-semibold transition-colors focus:ring-0",
                "disabled:bg-extra-light-gray disabled:text-dark-gray disabled:cursor-default",
                buttonVariants({ variant, [color]: variant, size }),
                className,
            )}
            {...rest}
        >
            {children}
        </button>
    );
};

const buttonIconSizes = {
    [Size.TINY]: "px-1 py-1 leading-xs", // 20px // TODO: Figma has 24px for Split payment
    [Size.SMALL]: "size-7.5 px-1 py-1.5 leading-sm", // 30px
    [Size.MEDIUM]: "size-10 leading-base", // 40px
    [Size.LARGE]: "size-10 leading-base", // 40px
};

interface IconButtonProps extends Except<ButtonProps, "children"> {
    icon: ReactNode;
    isSubmitting?: boolean;
    size: Size | SizeNames;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    (
        {
            size = Size.MEDIUM,
            color = Color.SECONDARY,
            variant = Variant.OUTLINE,
            isSubmitting = false,
            icon,
            className,
            ...rest
        },
        ref,
    ) => (
        <button
            ref={ref}
            type="button"
            className={cn(
                `ui-icon-button ui-icon-button-${color} ui-icon-button-${variant}`,
                "inline-flex items-center justify-center rounded border focus:ring-0",
                "disabled:bg-extra-light-gray disabled:text-dark-gray disabled:cursor-not-allowed",
                buttonVariants({ variant, [color]: variant }),
                buttonIconSizes[size],
                className,
            )}
            {...rest}
        >
            {isSubmitting ? "..." : icon}
        </button>
    ),
);

IconButton.displayName = "IconButton";
