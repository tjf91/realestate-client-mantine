import { Button } from "@mantine/core";
import { PropsWithChildren } from "react";

interface TabButtonProps extends PropsWithChildren {
  active?: boolean;
  onClick?: () => void;
}

export default function TabButton({
  active,
  onClick,
  children,
}: TabButtonProps) {
  return (
    <Button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: 8,
        border: active ? "1px solid #2563eb" : "1px solid #e5e7eb",
        background: active ? "#215394ff" : "#8f0606ff",
        cursor: "pointer",
      }}
    >
      {children}
    </Button>
  );
}
