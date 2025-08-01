import { isEmpty } from "lodash-es";
import React, { forwardRef } from "react";
import { Dot } from "../Dot";
import { cn } from "@/utils/classnames";

const sizes = {
    small: "px-3 py-2 h-7.5 text-sm leading-sm", // 30px
    medium: "px-3 py-2.5 text-base leading-base", // 40px
    large: "px-5 py-3.5 text-md leading-md", // 50px
};

export interface BaseInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    as?: any;
    size?: keyof typeof sizes;
    className?: string;
    isError?: boolean;
    isRequired?: boolean;
    value?: string | number;
    classNames?: { dot: string }; // Use this to adjust the positioning of the 'Dot' if the field is required
}

export const BaseInput = forwardRef(
    ({ as: Tag, size = "medium", isError, className, isRequired, value, classNames, ...rest }: BaseInputProps, ref) => {
        // Since the input can only be a string or a number, added the toString method for a numeric value, because lodash's IsEmpty method returns true for any number.
        const isEmptyValue = isEmpty(value?.toString());

        return (
            <div className="relative flex w-full items-center">
                <Tag
                    ref={ref}
                    className={cn(
                        "text-extra-dark-gray placeholder-dark-gray hover:placeholder-extra-dark-gray disabled:text-gray w-full rounded",
                        "hover:bg-extra-light-gray disabled:bg-extra-light-gray border hover:border-black focus:text-black active:text-black",
                        sizes[size],
                        isError
                            ? "!focus:border-danger border-danger! focus:ring-danger focus:ring-0"
                            : "border-light-gray focus:border-primary focus:ring-primary focus:ring-0",
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

BaseInput.displayName = "BaseInput";
