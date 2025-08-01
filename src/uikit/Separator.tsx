import { cn } from "@/utils/classnames";

export const Separator = ({ className }: { className?: string }) => {
    return <hr role="separator" className={cn("text-light-gray", className)} />;
};
