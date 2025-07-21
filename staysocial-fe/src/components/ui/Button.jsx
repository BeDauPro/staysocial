import React from "react";
import { cn } from "../../lib/utils";

export function Button({ className, variant = "default", ...props }) {
  const base = "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200"
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}
