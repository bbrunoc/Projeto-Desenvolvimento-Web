// frontend/src/ui/button/index.js
import React from "react";

export function Button({ children, ...props }) {
  return (
    <button
      className="px-4 py-2 border rounded bg-white hover:bg-gray-100 transition-all"
      {...props}
    >
      {children}
    </button>
  );
}