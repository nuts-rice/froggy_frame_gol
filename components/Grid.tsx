export default function Grid({ children }: { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 1005 1005"
      opacity="0.9"
      display="flex"
      width="1005"
      height="1005"
    >
      {children}
    </svg>
  );
}
