import { InputHTMLAttributes, forwardRef, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const FieldLabel = ({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn("mb-1.5 block text-[12.5px] font-medium text-foreground", className)}
    {...props}
  />
);

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full min-w-0 rounded-md border-[1.5px] border-border bg-card px-3.5 py-3 text-[14.5px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full min-w-0 rounded-md border-[1.5px] border-border bg-card px-3.5 py-3 text-[14.5px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  );
}
