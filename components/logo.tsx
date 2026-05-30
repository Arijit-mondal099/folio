import { SITE_NAME } from "@/lib/constants";
import { cn } from "../lib/utils";

export const Logo = ({
  className
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <div className={cn("text-foreground flex items-center gap-2", className)}>
      <span className="text-xl font-semibold tracking-tight">{SITE_NAME}</span>
    </div>
  );
};
