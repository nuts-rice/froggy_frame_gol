import { Button, Frog, TextInput, parseEther, FrameContext } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/vercel";
import { redis } from "../lib/redis";
import { abi } from "../lib/FunFunGameOfLifeABI";
import { arbitrum } from "viem/chains";
import { Board } from "../components/Game";
import Grid from "../components/Grid";
import Card from "../components/Card";

import { v4 as uuidv4 } from "uuid";
import { SyndicateClient } from "@syndicateio/syndicate-node";
import { advanceGrid } from "../indexer/indexer";
import { neynar } from "frog/hubs";
import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";
// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

// const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
const syndicate = new SyndicateClient({
  token: () => {
    const apiKey = process.env.SYNDICATE_API_KEY;
    if (typeof apiKey === "undefined") {
      // If you receive this error, you need to define the SYNDICATE_API_KEY in
      // your Vercel environment variables. You can find the API key in your
      // Syndicate project settings under the "API Keys" tab.
      throw new Error(
        "SYNDICATE_API_KEY is not defined in environment variables.",
      );
    }
    return apiKey;
  },
});

const contract = process.env["CONTRACT_ADDRESS"] as `0x${string}`;

export const app = new Frog({
  // initialState: {
  //   board: ,
  // }
  assetsPath: "/",
  basePath: "/api",
  // browserLocation: "https://froggyframegol-nutsrices-projects.vercel.app/",
  // origin: "https://froggyframegol-nutsrices-projects.vercel.app/",
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY || "NEYNAR_FROG_FM" }),
  verify: "silent",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});
const HOST =
  process.env["HOST"] ||
  "https://froggyframegol-nutsrices-projects.vercel.app/";

app.frame("/", async (c: FrameContext) => {
  const env = c.env as any;
  console.log(env);
  let nullBoard = {
    boardId: uuidv4() as string,
    grid: {},
    generation: 0,
    lastEvolvedUser: "",
    lastEvolvedAt: 0,
    isExtinct: false,
    users: [],
    userGenerations: {},
    spawned_at: 0,
  };
  const target_url = ("/new_board_tx/" + nullBoard.boardId) as string;
  return c.res({
    image: "/init_img",
    intents: [
      <Button.Transaction target={target_url}>Start GoL</Button.Transaction>,
    ],
  });
});

app.image("/init_img", (c) => {
  return c.res({
    image: (
      <>
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: "#917289",

            fontSize: 24,
          }}
        >
          <Grid>
            <div style={{ display: "flex", marginTop: 8 }}> GoL </div>
            <g strokeWidth="1.25" stroke="hsla(0, 0%, 11%, 1.00)" fill="white">
              {new Array(20).fill(null).map((_, i) => {
                return (
                  <g key={i}>
                    {new Array(20).fill(null).map((_, j) => {
                      return (
                        <rect
                          key={j}
                          x={20 * j}
                          y={20 * i}
                          width={20}
                          height={20}
                          fill={"white"}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          </Grid>
        </div>
      </>
    ),
  });
});

app.frame("/init", async (c) => {
  let nullBoard = {
    boardId: uuidv4() as string,
    grid: {},
    generation: 0,
    lastEvolvedUser: "",
    lastEvolvedAt: 0,
    isExtinct: false,
    users: [],
    userGenerations: {},
    spawned_at: 0,
  };

  await redis.hset(`board:${nullBoard.boardId}`, nullBoard);
  const target_url = ("/new_board_tx/" + nullBoard.boardId) as string;
  return c.res({
    image: `/board_img/${nullBoard.boardId}`,
    intents: [
      <Button.Transaction target={target_url}>
        Create new board
      </Button.Transaction>,
      // <Button.Transaction target="/evolve_tx">
      //   Evolve this board
      // </Button.Transaction>,
    ],
  });
});
app.frame("/board/:boardId", async (c) => {
  const boardId = c.req.param("boardId");
  const target_url = ("/evolve_tx/" + boardId) as string;
  console.log("evolve url: " + target_url);
  return c.res({
    action: `/evolve_tx/${boardId}`,
    image: `/board_img/${boardId}`,
    intents: [
      <Button.Transaction target={target_url}>
        Evolve this board
      </Button.Transaction>,
    ],
  });
});

app.image("board_img/:boardId", async (c) => {
  const boardId = c.req.param("boardId");
  console.log("board: " + boardId + " loaded");
  const board: Board | null = await redis.hgetall(`board:${boardId}`);
  const grid = board?.grid;
  if (!board) {
    return c.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background: "black",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 20,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 15,
              padding: "0 120px",
              display: "flex",
              whiteSpace: "pre-wrap",
            }}
          >
            <h1> Board not found </h1>
          </div>
        </div>
      ),
    });
  }
  return c.res({
    headers: {
      "Cache-Control": "max-age=0",
    },
    image: (
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#917289",

          fontSize: 24,
        }}
      >
        <p fontSize="15"> Board {board.boardId} loaded </p>
        <p fontSize="15"> Generation #{board.generation} </p>
        <Grid>
          <g strokeWidth="1.25" stroke="hsla(0, 0%, 11%, 1.00)" fill="white">
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
                      />
                    );
                  })}
                </g>
              );
            })}
          </g>
        </Grid>
      </div>
    ),
  });
});

app.transaction("/new_board_tx/:boardId", (c) => {
  const { req } = c;
  const boardId = req.param("boardId");
  const { address } = c;

  let tx = c.contract({
    abi,
    chainId: `eip155:${arbitrum.id}`,
    functionName: "newBoard",
    args: [address, parseEther("0.00028"), boardId],
    to: contract,
    value: parseEther("0.00028"),
    attribution: true,
  });
  console.log(tx);
  return tx;
});

app.transaction("/evolve_tx/:boardId", async (c) => {
  const { req } = c;
  const { address } = c;
  const boardId = req.param("boardId");
  console.log("evolving boardid:" + boardId);
  console.log("evolving address:" + address);
  let tx = c.contract({
    abi,
    chainId: `eip155:${arbitrum.id}`,
    functionName: "evolve",
    args: [boardId, address],
    to: contract,
    value: parseEther("0.00028"),
    attribution: true,
  });
  console.log(tx);
  return tx;
});

app.frame("/finish_evolve", async (c) => {
  const { req } = c;

  const boardId = req.param("boardId");
  console.log("finish evolve boardid:" + boardId);
  //TODO clean this up after debug
  const board: Board | null = await redis.hgetall(`board:${boardId}`);
  const grid = board?.grid;
  advanceGrid(grid);
  // const debugGrid = [];
  // for (let i = 0; i < 40; i++) {
  //   for (let k = 0; k < 40; k++) {
  //     if (grid[i][k] === true) {
  //       debugGrid.push("1");
  //     } else {
  //       debugGrid.push("0");
  //     }
  //   }
  // }

  return c.res({
    image: `finish_evolve_img/${boardId}`,

    intents: [<Button value="New Board">New Board</Button>],
  });
});
app.image("finish_evolve_img/:boardId", async (c) => {
  const boardId = c.req.param("boardId");
  const board: Board | null = await redis.hgetall(`board:${boardId}`);
  const grid = board?.grid;
  if (!board) {
    return c.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background: "black",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 20,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 15,
              padding: "0 120px",
              display: "flex",
              whiteSpace: "pre-wrap",
            }}
          >
            <h1> Board not found </h1>
          </div>
        </div>
      ),
    });
  }
  // advanceGrid(grid)

  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 20,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 15,
            padding: "0 120px",
            display: "flex",
            whiteSpace: "pre-wrap",
          }}
        >
          <h1> Board {board.boardId} loaded </h1>
          <h1> Generation #{board.generation} </h1>
          <Grid>
            <g strokeWidth="1.25" stroke="hsla(0, 0%, 11%, 1.00)" fill="white">
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
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          </Grid>
        </div>
      </div>
    ),
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, { serveStatic });
export const GET = handle(app);
export const POST = handle(app);
