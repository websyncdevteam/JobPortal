import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import clsx from "clsx";
import React from "react";

export const Checkbox = React.forwardRef(
  ({ className, checked, onCheckedChange, id }, ref) => (
    <CheckboxPrimitive.Root
      className={clsx(
        "w-5 h-5 rounded border border-gray-400 flex items-center justify-center transition-colors",
        checked ? "bg-blue-600 border-blue-600" : "bg-white border-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      checked={checked}
      onCheckedChange={onCheckedChange}
      id={id}
      ref={ref}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="w-4 h-4 text-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);

Checkbox.displayName = "Checkbox";
