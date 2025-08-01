import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/classnames";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    error?: string;
    isDisabled?: boolean;
    isError?: boolean;
    className?: string;
    children: ReactNode;
}

export const Label = ({ error, isDisabled = false, isError = false, children, className, ...rest }: LabelProps) => {
    return (
        <label
            className={cn(
                "ui-label",
                "leading-p-130 mb-1 block text-sm font-bold",
                className,
                isError ? "text-danger" : isDisabled ? "text-gray" : "text-black",
                "transform transition-colors duration-150",
            )}
            {...rest}
        >
            {children}
            {error && <span className="text-danger text-sm">{error}</span>}
        </label>
    );
};
