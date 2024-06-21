import type { PropsWithChildren } from "react";

export default function Grid({ children }: { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 1200 1005"
      opacity="0.9"
      display="flex"
      width="1200"
      height="1005"
    >
      {children}
    </svg>
  );
}
