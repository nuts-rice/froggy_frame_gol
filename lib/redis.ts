import { Redis } from "@upstash/redis";
export const redis = new Redis({
  url: "https://integral-mullet-53743.upstash.io",
  token: "AdHvAAIncDE2YWM4ODY0ZDQ0NjQ0ZTQ4YTA3ZmM4ZDdhNWNlNzNkN3AxNTM3NDM",
});
export default redis;
