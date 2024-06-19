import { Board } from "@/app/components/Game";
import EvolveBoardPage from "@/app/components/Game";
import { CellGrid } from "@/app/indexer/indexer";
import { Cell } from "@/app/components/Game";
import Grid from "@/app/components/Grid";
import { redis } from "@/app/lib/redis";
import Head from "next/head";
import { Metadata, ResolvingMetadata } from "next";
import { height, width } from "@/app/components/Game";
import Card from "@/app/components/Card";
async function getBoard(boardId: string): Promise<Board> {
  let nullUsers: [] = [];
  let nullUserGens: Record<string, number> = {};
  let nullGrid: CellGrid = {};
  let nullBoard = {
    boardId: "",
    grid: nullGrid,
    generation: 0,
    isExtinct: false,
    lastEvolvedUser: "mishka",
    lastEvolvedAt: Date.now(),
    users: nullUsers,
    userGenerations: nullUserGens,
    spawned_at: Date.now(),
  };
  try {
    let board: Board | null =
      (await redis.hgetall(`board:${boardId}`)) || nullBoard;
    // let board: Board | null = await kv.hgetall(`board:${id}`);
    if (!board) {
      return nullBoard;
    }
    return board;
  } catch (error) {
    console.error(error);
    return nullBoard;
  }
}

type Props = {
  params: { boardId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const HOST = process.env["HOST"] ?? "https://gol-frame.vercel.app/";

  const id = params.boardId;
  const board = await getBoard(id);
  const postUrl = `${HOST}/api/evolve?boardId=${id}`;
  const evolveDataUrl = `${HOST}/api/tx`;
  const claimDataUrl = `${HOST}`;
  const evolvePostUrl = `${HOST}/api/tx-success`;
  const claimPostUrl = `${HOST}`;
  const imageUrl = `${HOST}/api/images/evolve?boardId=${id}`;
  const fcMetadata: Record<string, string> = {
    "fc:frame": "vNext",
    "fc:frame:post_url": postUrl,
    "fc:frame:image": imageUrl,
    "fc:frame:button:1": "🦠 Evolve this board",
    "fc:frame:button:1:action": "tx",
    "fc:frame:button:1:target": evolveDataUrl,
    "fc:frame:button:1:post_url": evolvePostUrl,
    "fc:frame:button:2": "Create new board",
    "fc:frame:button:2:action": "link",
    "fc:frame:button:2:target": claimDataUrl,
    "fc:frame:button:2:post_url": claimPostUrl,
  };
  return {
    title: "Board Id: " + id,
    openGraph: {
      title: "Board Id: " + id,
      images: [imageUrl],
    },
    other: {
      ...fcMetadata,
    },
    metadataBase: new URL(HOST || ""),
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const board = await getBoard(params.id);
  const grid = board.grid;

  // <EvolveBoard board={board}/>
  //          <EvolveBoardPage board={board}/>

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
          <Card>
            Cell Board View Generation: #{board.generation}
            <Grid>
              <g
                strokeWidth="1.25"
                stroke="hsla(0, 0%, 11%, 1.00)"
                fill="white"
              >
                {new Array(40).fill(null).map((_, i) => {
                  return (
                    <g key={i}>
                      {new Array(40).fill(null).map((_, j) => {
                        return (
                          <rect
                            key={j}
                            x={20 * j}
                            y={20 * i}
                            width={20}
                            height={20}
                            fill={grid[i] && grid[i][j] ? "black" : "white"}
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
          </Card>
        </main>
      </div>
    </>
  );
}
