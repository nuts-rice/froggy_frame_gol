import CellGrid from "../components/Game";
export const HEIGHT = 40;
export const WIDTH = 40;

export type CellGrid = boolean[][];

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
  const ops = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  ops.forEach(([dx, dy]) => {
    const newX = x + dx;
    const newY = y + dy;
    if (
      newX >= 0 &&
      newX < HEIGHT &&
      newY >= 0 &&
      newY < WIDTH &&
      grid[newX]?.[newY]
    ) {
      count++;
    }
  });

  return count;

  // if (grid[x]![y - 1]) {
  //   count++;
  // }
  // if (grid[x]![y + 1]) {
  //   count++;
  // }
  // if (grid[x + 1]![y]) {
  //   count++;
  // }
  // if (grid[x + 1]![y - 1]) {
  //   count++;
  // }
  // if (grid[x + 1]![y + 1]) {
  //   count++;
  // }
  // if (grid[+x + 1]![y]) {
  //   count++;
  // }
  // if (grid[+x - 1]![y - 1]) {
  //   count++;
  // }
  // if (grid[+x - 1]![y + 1]) {
  //   count++;
  // }
  // return count;
};

export const getCellIdx = (grid: CellGrid, x: number, y: number): number => {
  return x * Object.keys(grid).length + y + 1;
};

export const initGrid = (): CellGrid => {
  return new Array(HEIGHT).fill(false).map(() => new Array(WIDTH).fill(false));
};
export const applyPattern = (grid: CellGrid, pattern: number[][]): CellGrid => {
  const newGrid = grid.map((row) => row.slice());
  pattern.forEach(([x, y]) => {
    newGrid[x][y] = true;
  });
  return newGrid;
};

export const advanceGrid = (grid: CellGrid): CellGrid => {
  const newGrid = initGrid();
  for (let x = 0; x < HEIGHT; x++) {
    for (let y = 0; y < WIDTH; y++) {
      const liveNeighbors = getLiveNeighbors(grid, x, y);
      if (grid[x][y]) {
        newGrid[x][y] = liveNeighbors === 2 || liveNeighbors === 3;
      } else {
        newGrid[x][y] = liveNeighbors === 3;
      }
    }
  }
  return newGrid;
};
