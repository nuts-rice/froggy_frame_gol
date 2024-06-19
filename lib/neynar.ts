import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { NEYNAR_API_KEY } from "@/app/config";
const neynar = new NeynarAPIClient(NEYNAR_API_KEY);

export default neynar;
