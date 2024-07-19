import { DuneClient } from "@cowprotocol/ts-dune-client";
const DUNE_API_KEY = process.env["DUNE_API_KEY"];
export const dune = new DuneClient(DUNE_API_KEY ?? "");

//return url for this
export async function getPatternsData(pattern: string): Promise<string[]> {
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/00000/results?filters=query_pattern=${pattern}`,
    {
      method: "GET",
      headers: header,
    },
  );

  const patternsData: string[] = [];
  return patternsData;
}
