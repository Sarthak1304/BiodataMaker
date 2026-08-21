import { cn } from "@/lib/utils";

export function MobileShell({
  children,
  className,
  bg = "bg-ivory-50",
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  bg?: string;
  wide?: boolean;
}) {
  return (
    <div className={cn("min-h-screen", bg)}>
      <div
        className={cn(
          "mx-auto min-h-screen w-full max-w-[480px]",
          wide && "lg:max-w-[1140px]",
          bg,
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
