import type { ReactNode } from "react";
import { cn } from "@/utils/classnames";

export const FormGroup = ({ children, className, ...rest }: { children: ReactNode; className?: string }) => {
    return (
        <div className={cn("ui-form-group", "mb-4", className)} {...rest}>
            {children}
        </div>
    );
};
