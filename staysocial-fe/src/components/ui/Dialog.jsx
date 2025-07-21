import { useState } from "react";

export function Dialog({ open, onOpenChange, children }) {
  return open ? (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-4">{children}</div>
    </div>
  ) : null;
}

export function DialogTrigger({ asChild, children }) {
  return children;
}

export function DialogContent({ children }) {
  return <div>{children}</div>;
}
