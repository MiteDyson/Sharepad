import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({ className, variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 shadow-sm",
    secondary:
      "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 border border-zinc-200 shadow-sm",
    ghost: "hover:bg-zinc-100 text-zinc-900",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export const Input = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

export const Card = ({ className, children }) => (
  <div
    className={cn(
      // FIX: Added 'dark:shadow-none' to remove shadows in dark mode globally
      "rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm dark:shadow-none",
      className
    )}
  >
    {children}
  </div>
);
