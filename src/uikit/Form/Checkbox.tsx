import { useId } from "react";
import { cn } from "@/utils/classnames";

interface CheckboxProps {
    label: React.ReactNode;
    isChecked?: boolean;
    className?: string;
    classNames?: {
        checkbox?: string;
        label?: string;
    };
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    [key: string]: any;
}

export const Checkbox = ({ label, className, isChecked = false, classNames = {}, ...rest }: CheckboxProps) => {
    const id = useId();

    return (
        <div className={cn("ui-checkbox", className, "flex items-center")}>
            <input
                type="checkbox"
                checked={isChecked}
                className={cn(
                    "ui-checkbox-input",
                    classNames.checkbox,
                    "border-light-gray size-4 appearance-none rounded outline-none",
                    "disabled:bg-light-gray disabled:text-gray-light",
                )}
                {...rest}
                id={id}
            />

            {label ? (
                <label
                    htmlFor={id}
                    className={cn("ui-checkbox-label", classNames.label, "text-extra-dark-gray ml-2 leading-none")}
                >
                    {label}
                </label>
            ) : null}
        </div>
    );
};
