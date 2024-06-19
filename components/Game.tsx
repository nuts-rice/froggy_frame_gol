"use client";
import {
  useOptimistic,
  useEffect,
  useState,
  useCallback,
  useRef,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
import asTable from "as-table";
import { saveBoard, evolveBoard } from "@/app/api/action";
import Grid from "@/app/components/Grid";
import Cell from "@/app/components/Cell";
import { CellGrid } from "@/app/indexer/indexer";
import { HEIGHT, WIDTH } from "@/app/indexer/indexer";
import {
  advanceGrid,
  getCells,
  getLiveNeighbors,
  getCellIdx,
} from "@/app/indexer/indexer";
export const height = 40;
export const width = 40;
export const MAX_BOARD_GENERATIONS = 150;
type Position = {
  x: number;
  y: number;
};

export type Cell = {
  position: Position;
  state: number;
};

//1 is alive, 0 is dead
function get_next_cell_state(cell: Cell, live_neighbors: number): number {
  if (cell.state === 1) {
    if (live_neighbors < 2 || live_neighbors > 3) {
      return 0;
    }
    return 1;
  }
  if (live_neighbors === 3) {
    return 1;
  } else {
    return 0;
  }
}

export type Board = {
  boardId: string;
  grid: CellGrid;
  generation: number;
  lastEvolvedUser: string;
  lastEvolvedAt: number;
  isExtinct: boolean;
  users: string[];
  //maps user to number of generations they have evolved this board
  userGenerations: { [key: string]: number };
  //time when the board was created
  spawned_at: number;
};

// export interface Boards {
//   board: Board;
// }

type CellState = {
  isAlive: boolean;
  pending: boolean;
  userSelected?: boolean;
};

type BoardState = {
  newBoard: Board;
  updatedBoard?: Board;
  pending: boolean;
  evolved?: boolean;
};

export function EvolveBoardPage({ board }: { board: Board }) {
  const [grid, setGrid] = useState<CellGrid>(() => getCells(width));
  const router = useRouter();
  const searchParams = useSearchParams();
  let evolvedBoard = evolveBoard.bind(null, board);
  let userId = searchParams.get("userId") || "";
  return (
    <>
      <div tw="flex w-full">
        <div tw="ml-3 flex rounded-md shadow">
          <button
            onClick={() => {
              evolveBoard(board, userId);
            }}
          >
            Evolve
          </button>
        </div>
        <div tw="ml-3 flex rounded-md shadow"></div>
      </div>
    </>
  );
}

function CreateCells(): Cell[] {
  const cells = [];
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      const cell: Cell = { position: { x: i, y: j }, state: 0 };
      cells.push(cell);
    }
  }
  return cells;
}
const patterns = {
  acorn: [
    [1, 6],
    [2, 8],
    [3, 5],
    [3, 6],
    [3, 9],
    [3, 10],
    [3, 11],
  ],
  glider: [
    [0, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  gosperGliderGun: [
    [5, 1],
    [5, 2],
    [6, 1],
    [6, 2],
    [5, 11],
    [6, 11],
    [7, 11],
    [4, 12],
    [8, 12],
    [3, 13],
    [9, 13],
    [3, 14],
    [9, 14],
    [6, 15],
    [4, 16],
    [8, 16],
    [5, 17],
    [6, 17],
    [7, 17],
    [6, 18],
    [3, 21],
    [4, 21],
    [5, 21],
    [3, 22],
    [4, 22],
    [5, 22],
    [2, 23],
    [6, 23],
    [1, 25],
    [2, 25],
    [6, 25],
    [7, 25],
    [3, 35],
    [4, 35],
    [3, 36],
    [4, 36],
  ],
};

// export function EvolveBoard(board: Board, )  {
//   return ()
// }
export function CreateBoard() {
  const [grid, setGrid] = useState<CellGrid>(() => getCells(width));
  const [liveCellsIdx, setLiveCellsIdx] = useState<number[]>([]);
  const [board, setBoard] = useState<Board | undefined>();
  let [isPending, startTransition] = useTransition();
  // let [state, mutate] = useOptimistic(
  //     { pending: false },
  //     function createReducer(state, newBoard: BoardState){
  //       return{
  //         ...state,
  //         pending: newBoard.pending,
  //       }
  //     }
  // );

  let boardStub = {
    boardId: uuidv4(),
    cells: [],
    generation: 1,
    lastEvolvedUser: "",
    grid: grid,
    lastEvolvedAt: 0,
    users: [],
    userGenerations: {},
    spawned_at: new Date().getTime(),
    isExtinct: false,
  };
  let savedBoard = saveBoard.bind(null, boardStub);

  useEffect(() => {
    initialize();
  }, []);
  const initialize = useCallback(() => {
    const cells = getCells(width);
    //acorn
    // cells[1]![6] = true;
    // cells[2]![8] = true;
    // cells[3]![5] = true;
    // cells[3]![6] = true;
    // cells[3]![9] = true;
    // cells[3]![10] = true;
    // cells[3]![11] = true;

    setGrid(cells);
  }, []);
  const handleCellClick = (i: number, j: number) => {
    setGrid((prevGrid) => {
      const newGrid = { ...prevGrid };
      newGrid[i][j] = !newGrid[i][j];
      return newGrid;
    });
  };
  const applyPattern = (pattern: number[][]) => {
    setGrid((prevGrid) => {
      const newGrid = getCells(width);
      pattern.forEach(([i, j]) => {
        newGrid[i]![j] = true;
      });
      return newGrid;
    });
  };
  return (
    <>
      <Grid>
        <g strokeWidth="1.25" stroke="hsla(0, 0%, 11%, 1.00)" fill="white">
          {new Array(height).fill(null).map((_, i) => {
            return (
              <g key={i}>
                {new Array(width).fill(null).map((_, j) => {
                  return (
                    <rect
                      key={j}
                      x={20 * j}
                      y={20 * i}
                      width={20}
                      height={20}
                      fill={grid[i] && grid[i][j] ? "black" : "white"}
                      onClick={() => handleCellClick(i, j)}
                      style={{
                        width: "20",
                        height: "20",
                        backgroundColor: "white",
                        border: "1px solid black",
                      }}
                    />
                  );
                })}
              </g>
            );
          })}
        </g>
      </Grid>
      <div tw="flex w-full">
        <div tw="ml-3 flex rounded-md shadow">
          <button onClick={() => applyPattern(patterns.acorn)}>Acorn</button>
        </div>
        <div tw="ml-3 flex rounded-md shadow">
          <button onClick={() => applyPattern(patterns.glider)}>Glider</button>
        </div>
        <div tw="ml-3 flex rounded-md shadow">
          <button onClick={() => applyPattern(patterns.gosperGliderGun)}>
            Gosper Glider Gun
          </button>
        </div>
        <div tw="ml-3 flex rounded-md shadow">
          <button
            onClick={() => {
              let newBoard = {
                boardId: uuidv4(),
                cells: [],
                generation: 1,
                lastEvolvedUser: "dummy",
                grid: grid,
                lastEvolvedAt: new Date().getTime(),
                users: ["dummy"],
                userGenerations: { dummy: 1 },
                spawned_at: new Date().getTime(),
                isExtinct: false,
              };
              // startTransition(async () => {
              // mutate({
              // newBoard,
              // pending: true,
              // });

              saveBoard(newBoard);
            }}
            type="submit"
            // disabled={state.pending}
          >
            Create New Board
          </button>
        </div>
      </div>
    </>
  );
}

export default function Game() {
  // const [boards, setBoard] = useState<Board>();
  // useEffect(() => {
  //   const getBoard = async () => {
  //     let res = await fetch('api/board', { next: { revalidate: 1000 } });

  //     const _board = await res.json();
  //     setBoard(_board);
  //   };
  //   getBoard();
  // }, []);
  return (
    <div>
      <h1> Game of Life </h1>
      <p> Create board view </p>

      <p>
        Evolve on{" "}
        <a
          className="text-fc-purple underline"
          href="https://warpcast.com/0x0f/"
          target="_blank"
        ></a>{" "}
      </p>
      <div>
        <CreateBoard />
      </div>
    </div>
  );
}
