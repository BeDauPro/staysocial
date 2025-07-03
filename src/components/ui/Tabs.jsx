import { useState } from "react";
import React from "react";

export function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div>
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "TabsList") {
          return React.cloneElement(child, { value, setValue });
        }
        if (child.type.displayName === "TabsContent") {
          return child.props.value === value ? child : null;
        }
        return child;
      })}
    </div>
  );
}


export function TabsList({ children, value, setValue }) {
  return (
    <div className="flex space-x-2 border-b mb-4">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isActive: child.props.value === value, setValue })
      )}
    </div>
  );
}
TabsList.displayName = "TabsList";

export function TabsTrigger({ value, isActive, setValue, children }) {
  return (
    <button
      onClick={() => setValue(value)}
      className={`px-4 py-2 font-medium border-b-2 ${
        isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600"
      }`}
    >
      {children}
    </button>
  );
}
TabsTrigger.displayName = "TabsTrigger";

export function TabsContent({ value, children }) {
  return <div>{children}</div>;
}
TabsContent.displayName = "TabsContent";
