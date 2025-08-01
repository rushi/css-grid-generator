import { isEmpty } from "lodash-es";
import React, { forwardRef } from "react";
import { Dot } from "../Dot";
import { cn } from "@/utils/classnames";

interface TextAreaProps extends Omit<React.InputHTMLAttributes<HTMLTextAreaElement>, "size"> {
    className?: string;
    type?: string;
    value?: string | number;
    isError?: boolean;
    isRequired?: boolean;
    classNames?: { dot: string }; // Use this to adjust the positioning of the 'Dot' if the field is required
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, value, isError, isRequired, classNames, ...rest }, ref) => {
        const isEmptyValue = isEmpty(value?.toString());
        return (
            <div className="relative flex w-full items-center">
                <textarea
                    ref={ref}
                    className={cn(
                        "ui-textarea",
                        isError ? "focus:border-danger! border-danger!" : "border-light-gray",
                        className,
                    )}
                    value={value}
                    {...rest}
                />
                {isRequired && isEmptyValue && (
                    <Dot className={cn("absolute right-3", classNames?.dot)} color="danger" />
                )}
            </div>
        );
    },
);

TextArea.displayName = "TextArea";
