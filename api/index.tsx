import { Button, Frog, TextInput, parseEther } from "frog";
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
import { advanceGrid } from "../indexer/indexer";
import { neynar } from "frog/hubs";
// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  // initialState: {
  //   board: ,
  // }
  assetsPath: "/",
  basePath: "/api",
  // browserLocation: "https://froggyframegol-nutsrices-projects.vercel.app/",
  // origin: "https://froggyframegol-nutsrices-projects.vercel.app/",
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY || "NEYNAR_FROG_FM" }),
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});
const HOST =
  process.env["HOST"] ||
  "https://froggyframegol-nutsrices-projects.vercel.app/";

app.frame("/", async (c) => {
  return c.res({
    image: "/init_img",
    intents: [
      <Button action="/init" value="init">
        Start GoL
      </Button>,
    ],
  });
});

app.image("/init_img", (c) => {
  return c.res({
    image: (
      <>
        <Card>
          <Grid>
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
        </Card>
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
  return c.res({
    image: `/board_img/${nullBoard.boardId}`,
    intents: [
      <Button.Transaction target="/new_board_tx">
        Create new board
      </Button.Transaction>,
      <Button.Transaction target="/evolve_tx">
        Evolve this board
      </Button.Transaction>,
    ],
  });
});
app.frame("/board/:boardId", async (c) => {
  const boardId = c.req.param("boardId");
  return c.res({
    action: `/evolve_tx/${boardId}`,
    image: `/board_img/${boardId}`,
    intents: [
      <Button.Transaction target="evolve_tx">
        Evolve this board
      </Button.Transaction>,
    ],
  });
});

app.image("board_img/:boardId", async (c) => {
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
  return c.res({
    headers: {
      "Cache-Control": "max-age=0",
    },
    image: (
      <Card>
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
      </Card>
    ),
  });
});

app.transaction("/new_board_tx", (c) => {
  const { address } = c;
  return c.contract({
    abi,
    chainId: `eip155:${arbitrum.id}`,
    functionName: "newBoard",
    args: [address],
    to: process.env["CONTRACT_ADDRESS"] as `0x${string}`,
    value: parseEther("0.00028"),
    attribution: true,
  });
});

app.transaction("/evolve_tx", (c) => {
  const boardId = c.req.param("boardId");
  const { address } = c;
  return c.contract({
    abi,
    chainId: `eip155:${arbitrum.id}`,
    functionName: "evolve",
    args: [boardId, address as `0x${string}`],
    to: process.env["CONTRACT_ADDRESS"] as `0x${string}`,
    value: parseEther("0.00028"),
    attribution: true,
  });
});

app.frame("/finish_evolve", async (c) => {
  const boardId = c.req.param("boardId");
  //TODO clean this up after debug
  const board: Board | null = await redis.hgetall(`board:${boardId}`);
  const grid = board?.grid;
  // advanceGrid(grid)
  const debugGrid = [];
  for (let i = 0; i < 40; i++) {
    for (let k = 0; k < 40; k++) {
      if (grid[i][k] === true) {
        debugGrid.push("1");
      } else {
        debugGrid.push("0");
      }
    }
  }

  return c.res({
    image: `finish_evolve_img/${boardId}`,

    intents: [<Button value="New Board">New Board</Button>],
  });
});
app.image("finish_evolve_img/:boardId", async (c) => {
  const boardId = c.req.param("boardId");
  const board: Board | null = await redis.hgetall(`board:${boardId}`);

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
  const grid = board?.grid;
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
