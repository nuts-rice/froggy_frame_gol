export default function Cell(x: number, y: number, isAlive: boolean) {
  return (
    <rect
      width="64"
      height="64"
      x={x * 64}
      y={y * 64}
      fill={isAlive ? "black" : "white"}
    ></rect>
  );
}
