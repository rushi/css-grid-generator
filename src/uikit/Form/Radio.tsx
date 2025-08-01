import React from "react";
import type { BaseInputProps } from "./BaseInput";
import { Label } from "./Label";
import { cn } from "@/utils/classnames";

export interface RadioProps extends Omit<BaseInputProps, "size" | "classNames"> {
    name: string;
    value: string;
    isError?: boolean;
    checked: boolean; // For HTMLInputElement it is 'checked' instead of 'isChecked'
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
    classNames?: {
        input?: string;
    };
}

export const Radio = ({
    name,
    value,
    checked,
    isError = false,
    disabled = false,
    children,
    className,
    classNames,
    ...rest
}: RadioProps) => {
    const inputClassName = disabled ? "bg-extra-light-gray!" : "cursor-pointer";
    return (
        <Label data-testid="radio-input-label" isError={isError} className={cn("flex w-fit font-normal", className)}>
            <input
                checked={checked}
                disabled={disabled}
                value={value}
                type="radio"
                name={name}
                className={cn("mr-2 size-4", classNames?.input, disabled && checked ? "opacity-80" : inputClassName)}
                {...rest}
            />
            <span>{children}</span>
        </Label>
    );
};
