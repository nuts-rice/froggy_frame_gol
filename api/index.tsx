import { Button, Frog, TextInput, parseEther, FrameContext } from "frog";
import { createSystem } from "frog/ui";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { neynar } from "frog/middlewares";
import { handle } from "frog/vercel";
import { redis } from "../lib/redis";
import { abi } from "../lib/FunFunGameOfLifeABI";
import { arbitrum } from "viem/chains";
import { Board } from "../components/Game";
import Grid from "../components/Grid";
import Card from "../components/Card";
import neynarClient from "../lib/neynar";
import { v4 as uuidv4 } from "uuid";
// import { SyndicateClient } from "@syndicateio/syndicate-node";
import { advanceGrid, initGrid } from "../indexer/indexer";
import { arbiUrl } from "../constants";
// import { app as images } from "./images";
// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

// const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
// const syndicate = new SyndicateClient({
//   token: () => {
//     const apiKey = process.env.SYNDICATE_API_KEY;
//     if (typeof apiKey === "undefined") {
//       // If you receive this error, you need to define the SYNDICATE_API_KEY in
//       // your Vercel environment variables. You can find the API key in your
//       // Syndicate project settings under the "API Keys" tab.
//       throw new Error(
//         "SYNDICATE_API_KEY is not defined in environment variables.",
//       );
//     }
//     return apiKey;
//   },
// });

const contract = process.env["CONTRACT_ADDRESS"] as `0x${string}`;
export const app = new Frog({
  // initialState: {
  //   board: ,
  // }
  assetsPath: "/",
  basePath: "/api",
  hub: neynarClient.hub(),
  verify: "silent",
  browserLocation: "/:path",
}).use(neynarClient.middleware({ features: ["interactor", "cast"] }));

const HOST =
  process.env["HOST"] ||
  "https://froggyframegol-nutsrices-projects.vercel.app/";

// app.route("/images", images);

app.frame("/", async (c) => {
  const env = c.env as any;
  console.log("env: " + env);
  const boardId = uuidv4();
  const target_url = `/new_board_tx/${boardId}`;
  console.log("new board target_url: " + target_url);
  return c.res({
    image: "/init_img",
    action: `/finish_new_board/${boardId}`,
    intents: [
      <Button.Transaction target={target_url}>Start GoL</Button.Transaction>,
    ],
  });
});

app.frame("/choose_patterns", async (c) => {
  const { buttonValue } = c;
  if (buttonValue === "glider") {
    const boardId = uuidv4();
    const target_url = `/new_board_tx/${boardId}`;
    return c.res({
      image: "/choose_glider_img",
      action: `/finish_new_board/${boardId}`,
      intents: [
        <Button.Transaction target={target_url}>Submit</Button.Transaction>,
        <Button action="/choose_patterns">Choose pattern</Button>,
      ],
    });
  }
  if (buttonValue === "blinker") {
    const boardId = uuidv4();
    const target_url = `/new_board_tx/${boardId}`;
    return c.res({
      image: "/choose_blinker_img",
      action: `/finish_new_board/${boardId}`,
      intents: [
        <Button.Transaction target={target_url}>Submit</Button.Transaction>,
        <Button action="/choose_patterns">Choose pattern</Button>,
      ],
    });
  }
  if (buttonValue === "glider gun") {
    const boardId = uuidv4();
    const target_url = `/new_board_tx/${boardId}`;
    return c.res({
      image: "/choose_glider_gun_img",
      action: `/finish_new_board/${boardId}`,
      intents: [
        <Button.Transaction target={target_url}>Submit</Button.Transaction>,
        <Button action="/choose_patterns">Choose pattern</Button>,
      ],
    });
  }
  if (buttonValue === "random") {
    const boardId = uuidv4();
    const target_url = `/new_board_tx/${boardId}`;
    return c.res({
      image: "/choose_random_img",
      action: `/finish_new_board/${boardId}`,
      intents: [
        <Button.Transaction target={target_url}>Submit</Button.Transaction>,
        <Button action="/choose_patterns">Choose pattern</Button>,
      ],
    });
  }
  return c.res({
    image: "/choose_patterns_img",
    intents: [
      <Button value="glider">Glider</Button>,
      <Button value="blinker">Blinker</Button>,
      <Button value="glider gun">Glider Gun</Button>,
      <Button value="random">Random</Button>,
    ],
  });
});

app.image("/choose_glider_img", (c) => {
  return c.res({
    image: (
      <>
        <Card>
          <Grid>
            <div style={{ display: "flex", marginTop: 8 }}> Glider </div>
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

app.image("/choose_patterns_img", (c) => {
  return c.res({
    image: (
      <>
        <Card>
          <Grid>
            <div style={{ display: "flex", marginTop: 8 }}>
              {" "}
              Choose a pattern{" "}
            </div>
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

app.image("/init_img", (c) => {
  return c.res({
    image: (
      <>
        <Card>
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
        </Card>
      </>
    ),
  });
});
//TODO: move board mutations to after tx
app.frame("/init", async (c) => {
  const canidate_boardId = uuidv4() as string;
  const target_url = ("/new_board_tx/" + canidate_boardId) as string;
  return c.res({
    action: `/finish_new_board/${canidate_boardId}`,
    image: `/board_img/${canidate_boardId}`,
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
  const tx_target_url = ("/evolve_tx/" + boardId) as string;
  const debug_target_url = ("/debug_evolve/" + boardId) as string;
  console.log("evolve tx url: " + tx_target_url);
  return c.res({
    action: `/finish_evolve/${boardId}`,
    image: `/board_img/${boardId}`,
    intents: [
      <Button.Transaction target={tx_target_url}>
        Evolve this board
      </Button.Transaction>,
      <Button action={debug_target_url}> Debug evolve </Button>,
    ],
  });
});

app.frame("/debug_evolve/:boardId", async (c) => {
  const { req } = c;
  const boardId = req.param("boardId");
  //TODO clean this up after debug
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
  } else {
    console.log("evolving boardid:" + boardId);
    await redis.hincrby(`board:${boardId}`, "generations", 1);
    console.log(
      "board generation incremented : generation #",
      +board.generation,
    );
    // await redis.zincrby('userGenerations', 1, board.userGenerations[username]);

    const grid = board?.grid;
    advanceGrid(grid);
  }

  return c.res({
    image: `/finish_debug_evolve_img/${boardId}`,

    intents: [<Button value="New Board">New Board</Button>],
  });
});

app.image("/board_img/:boardId", async (c) => {
  const boardId = c.req.param("boardId");
  console.log("board: " + boardId + " loaded");
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
  const grid = board.grid;

  return c.res({
    image: (
      <Card>
        <p style={{ fontSize: 15 }}> Board {board.boardId} loaded </p>
        <p style={{ fontSize: 15 }}> Generation #{board.generation} </p>
        <p style={{ fontSize: 15 }}>
          {" "}
          Last evolved by: {board.lastEvolvedUser}{" "}
        </p>

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

app.transaction("/new_board_tx/:boardId", async (c) => {
  const { req } = c;
  const { address } = c;
  const boardId = req.param("boardId");
  console.log("new board tx id:" + boardId);
  console.log("new board tx address:" + address);
  const tx = c.contract({
    abi,
    chainId: `eip155:${arbitrum.id}`,
    functionName: "newBoard",
    args: [address, parseEther("0.00001"), boardId],
    to: contract,
    value: parseEther("0.00001"),
    attribution: true,
  });
  console.log(tx);
  return tx;
});

app.transaction("/evolve_tx/:boardId/", async (c) => {
  const { req } = c;
  const { address } = c;
  const boardId = req.param("boardId");
  console.log("evolving boardid:" + boardId);
  console.log("evolving address:" + address);
  // const user = await neynarClient.lookupUserByVerification(address);
  // const username = user.result.user.username;
  // await redis.hincrby(`board:${boardId}`, 'generations', 1);
  // await redis.zincrby('userGenerations', 1, board.userGenerations[username]);

  // await redis.zincrby(`boa`, 1, "evolve");
  return c.contract({
    abi,
    chainId: `eip155:${arbitrum.id}`,
    functionName: "evolve",
    args: [boardId, address],
    to: contract,
    value: parseEther("0.00001"),
    attribution: true,
  });
});

// app.image("/finish_debug_evolve_img/:boardId", async (c) => {
// }

// app.frame("/finish_debug_evolve/:boardId", async (c) => {

// }

app.frame("/finish_new_board/:boardId", async (c) => {
  const { req } = c;
  const { transactionId } = c;
  const { displayName } = c.var.interactor || {};
  const boardId = req.param("boardId");
  console.log("finish new boardid:" + boardId);
  console.log("new board user: " + displayName);
  await redis.hset(`board:${boardId}`, {
    boardId,
    grid: initGrid(),
    generation: 1,
    lastEvolvedUser: displayName,
    lastEvolvedAt: Date.now(),
    isExtinct: false,
    users: [],
    userGenerations: {},
    spawned_at: Date.now(),
  });
  const board: Board | null = await redis.hgetall(`board:${boardId}`);
  if (board) {
    await redis.expire(`board:${board.boardId}`, 1388389425);
    await redis.zadd("boards_by_date", {
      score: Number(board.spawned_at),
      member: board.boardId,
    });
  }

  // if (username) {
  //     await redis.zincrby('userGenerations', 1, board.userGenerations[username]);
  //     // await redis.hset('users',  board.users[username]);
  //   };
  // }
  const txUrl = transactionId ? arbiUrl(transactionId) : null;
  return c.res({
    image: `/boad_img/${boardId}`,
    intents: [
      txUrl ? <Button.Link href={txUrl}> View Tx </Button.Link> : null,
      <Button value="New Board">New Board</Button>,
    ],
  });
});

app.frame("/finish_evolve/:boardId", async (c) => {
  const { req } = c;
  const { transactionId } = c;
  const txUrl = transactionId ? arbiUrl(transactionId) : null;
  const boardId = req.param("boardId");
  console.log("finish evolve boardid:" + boardId);
  //TODO clean this up after debug
  const board: Board | null = await redis.hgetall(`board:${boardId}`);
  console.log("evolving boardid:" + boardId);
  const { displayName } = c.var.interactor || {};
  console.log("evolving username:" + displayName);
  await redis.hincrby(`board:${boardId}`, "generation", 1);
  console.log("board generation incremented : generation #", board?.generation);
  await redis.zincrby("userGenerations", 1, displayName);
  const grid = board?.grid || {};
  const newGrid = advanceGrid(grid);
  await redis.hset(`board:${boardId}`, {
    grid: JSON.stringify(newGrid),
    lastEvolvedUser: displayName,
    lastEvolvedAt: Date.now(),
    users: [...(board?.users || ""), displayName],
  });
  console.log("advance grid called");
  console.log("new grid state saved: " + newGrid);

  return c.res({
    image: `/finish_evolve_img/${boardId}`,

    intents: [
      txUrl ? <Button.Link href={txUrl}> View Tx </Button.Link> : null,
      <Button value="New Board">New Board</Button>,
    ],
  });
});
app.image("/finish_evolve_img/:boardId", async (c) => {
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
  // advanceGrid(grid)
  const grid = board.grid;

  return c.res({
    image: (
      <Card>
        <p style={{ fontSize: 15 }}> Board {board.boardId} loaded </p>
        <p style={{ fontSize: 15 }}> Generation #{board.generation} </p>
        <p style={{ fontSize: 15 }}>
          {" "}
          Last evolved by: #{board.lastEvolvedUser}{" "}
        </p>
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

app.frame("/finish_debug_evolve/:boardId", async (c) => {
  const { req } = c;
  const { transactionId } = c;
  const boardId = req.param("boardId");
  console.log("finish evolve boardid:" + boardId);
  //TODO clean this up after debug
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
  } else {
    console.log("evolving boardid:" + boardId);
    const { displayName } = c.var.interactor || {};
    console.log("evolving board user: " + displayName);
    await redis.hincrby(`board:${boardId}`, "generation", 1);

    const grid = board?.grid;
    advanceGrid(grid);
    console.log("advance grid called");
  }

  return c.res({
    image: `/finish_debug_evolve_img/${boardId}`,

    intents: [
      // txUrl ? <Button.Link href={txUrl}> View Tx </Button.Link> : null,
      <Button value="New Board">New Board</Button>,
    ],
  });
});
app.image("/finish_debug_evolve_img/:boardId", async (c) => {
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
  // advanceGrid(grid)

  return c.res({
    image: (
      <Card>
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
                        fill={
                          board.grid[i] && board.grid[i][j] ? "black" : "white"
                        }
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

export const {
  Box,
  Columns,
  Column,
  Heading,
  HStack,
  Rows,
  Row,
  Spacer,
  Text,
  VStack,
  vars,
} = createSystem();

// const isEdgeFunction = typeof EdgeFunction !== "undefined";
// const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
export default app;
