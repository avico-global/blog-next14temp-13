import { cn } from "@/lib/utils";

export default function Container({ children, className, style }) {
  return (
    <div
      style={style}
      className={cn(
        "w-11/12 max-w-screen-2xl flex items-center justify-center flex-col bg-cover bg-center",
        className
      )}
    >
      {children}
    </div>
  );
}
