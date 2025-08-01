import { isEmpty } from "lodash-es";
import { Dot } from "../Dot";
import { cn } from "@/utils/classnames";

const sizes = {
    small: "px-3 py-1.5 text-sm leading-sm", // 30px
    medium: "px-3 py-2.5 text-base leading-base", // 40px
    large: "px-5 py-3.5 text-md leading-md", // 50px
};

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "value"> {
    size?: keyof typeof sizes;
    className?: string;
    isError?: boolean;
    isRequired?: boolean;
    value?: string | number;
}

// Note: This is deprecated in favor of the Select component from CustomSelect.tsx

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Select = ({ size = "medium", isError, className, isRequired, value, ...rest }: SelectProps) => {
    const isEmptyValue = isEmpty(value?.toString());
    return (
        <div className="relative flex w-full items-center">
            <select
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
            {isRequired && isEmptyValue && <Dot className="absolute right-7" color="danger" />}
        </div>
    );
};
