import CellGrid from "../components/Game";
export const HEIGHT = 40;
export const WIDTH = 40;

export type CellGrid = Record<string, boolean[]>;

export const getCells = (idx: number): CellGrid => {
  const cells = new Array(idx).fill(false);
  const _grid: any = { ...cells };
  Object.keys(_grid).forEach((key) => {
    _grid[key] = [...cells];
  });
  return _grid;
};

export const getLiveNeighbors = (
  grid: CellGrid,
  x: number,
  y: number,
): number => {
  let count = 0;
  if (grid[x]![y - 1]) {
    count++;
  }
  if (grid[x]![y + 1]) {
    count++;
  }
  if (grid[x + 1]![y]) {
    count++;
  }
  if (grid[x + 1]![y - 1]) {
    count++;
  }
  if (grid[x + 1]![y + 1]) {
    count++;
  }
  if (grid[+x + 1]![y]) {
    count++;
  }
  if (grid[+x - 1]![y - 1]) {
    count++;
  }
  if (grid[+x - 1]![y + 1]) {
    count++;
  }
  return count;
};

export const getCellIdx = (grid: CellGrid, x: number, y: number): number => {
  return x * Object.keys(grid).length + y + 1;
};

export const initGrid = (): CellGrid => {
  let grid: CellGrid = {};
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      grid[i]![j] = false;
    }
  }
  return grid;
};

export const advanceGrid = (grid: CellGrid): CellGrid => {
  let ToDie: any[] = [];
  let ToLive: any[] = [];
  let newCellGrid: CellGrid = Object.assign({}, grid);
  Object.keys(newCellGrid).forEach((col) => {
    newCellGrid[col]!.forEach((cell: any, rowIdx: any) => {
      if (cell) {
        if (
          getLiveNeighbors(grid, +col, rowIdx) < 2 ||
          getLiveNeighbors(grid, +col, rowIdx) > 3
        ) {
          grid[col]![rowIdx] = false;
        } else {
          grid[col]![rowIdx] = true;
        }
      }
    });
  });
  return newCellGrid;
};
