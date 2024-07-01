import { createNeynar } from "frog/middlewares";
import { config } from "dotenv";
config();
if (!process.env.NEYNAR_API_KEY) {
  throw new Error("Make sure you set NEYNAR_API_KEY in your .env file");
}

const neynarClient = createNeynar({ apiKey: process.env["NEYNAR_API_KEY"] });

export default neynarClient;
