import React from "react";

interface MessageProps {
  type?: "success" | "error" | "info" | "warning";
  children: React.ReactNode;
  show?: boolean;
}

export function Message({ type = "info", children, show = true }: MessageProps) {
  if (!show) return null;

  return (
    <div className={`message-${type}`}>
      {children}
    </div>
  );
}