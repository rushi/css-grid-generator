import { forwardRef } from "react";
import { BaseInput, type BaseInputProps } from "./BaseInput";
import { cn } from "@/utils/classnames";

interface InputProps extends BaseInputProps {
    className?: string;
    type?: string;
    value?: string | number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", value, ...rest }, ref) => {
    return (
        <BaseInput
            ref={ref}
            as="input"
            type={type}
            value={value}
            className={cn("ui-input px-2 md:px-3", className)}
            {...rest}
        />
    );
});

Input.displayName = "Input";

const NumberInput = forwardRef<HTMLInputElement, InputProps>(({ className, value, ...rest }, ref) => {
    return (
        <BaseInput
            ref={ref}
            as="input"
            type="number"
            value={value}
            className={cn(
                "ui-input",
                // This hides the stepper buttons in the number inputs
                "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                className,
            )}
            {...rest}
        />
    );
});

NumberInput.displayName = "NumberInput";
