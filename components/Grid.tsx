import type { PropsWithChildren } from 'react';

export default function Grid({ children }: { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 800 800"
      opacity="0.9"
      display="flex"
      width="800"
      height="800"
    >
      {children}
    </svg>
  );
}
