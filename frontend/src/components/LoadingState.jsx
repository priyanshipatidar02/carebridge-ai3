import React from "react";
export default function LoadingState({ message = "Loading safely..." }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      <p className="font-semibold text-primary">{message}</p>
    </div>
  );
}
