// export const contract: Record<String, `0x${string}`> = {
//   ARBIT
// }
//
import { arbitrum } from "viem/chains";

export function arbiUrl(tx: string, chain = arbitrum.name): string {
  const arbisan =
    chain === "Arbitrum One"
      ? "https://arbiscan.io"
      : "https://rinkeby.arbiscan.io";
  return `${arbisan}/tx/${tx}`;
}
