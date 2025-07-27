import {fetchDexScreener} from "./fetchData";
import {fetchCoinGeckoSolanaTokens} from "./fetchData";
import redis from "./rediConfig";

const CACHE_KEY = "aggregated_tokens";
const CACHE_TTL = 60 * 30; // 30 minutes  

function matchTokens(dsToken: any, cgToken: any) {
  return (
    dsToken.baseToken.symbol.toLowerCase() === cgToken.symbol.toLowerCase() &&
    dsToken.baseToken.name.toLowerCase() === cgToken.name.toLowerCase()
  );
}

export default function aggregateTokenData(dsToken: any, cgToken: any) {
  return {
    name: dsToken.baseToken.name,
    symbol: dsToken.baseToken.symbol,
    dexPriceUsd: dsToken.priceUsd,
    coingeckoPriceUsd: cgToken?.current_price || null,
    marketCap: dsToken.marketCap || cgToken?.market_cap || null,
    volume24h: dsToken.volume?.h24 || cgToken?.total_volume || null,
    priceChange24h: dsToken.priceChange?.h24 || cgToken?.price_change_percentage_24h || null,
    dex: dsToken.dexId,
    image: dsToken.info?.imageUrl || cgToken?.image,
    dexUrl: dsToken.url,
    rank: cgToken?.market_cap_rank || null,
  };
}

export async function aggregateTokens() {
  const cachedData = await redis.get(CACHE_KEY);
  if(cachedData){
    console.log("cache hit");
    return JSON.parse(cachedData);
  }
  const [dsPairs, cgTokens] = await Promise.all([
    fetchDexScreener("solana"),
    fetchCoinGeckoSolanaTokens(),
  ]);

  const aggregated = [];

  for (const dsToken of dsPairs) {
    if(!dsToken || !dsToken?.baseToken || !dsToken?.baseToken?.name){
      console.log("Skipping invalid DexScreener token:", dsToken);
      continue;
    }
    const match = cgTokens.find((cgToken) => matchTokens(dsToken, cgToken));
    aggregated.push(aggregateTokenData(dsToken, match));
  }

  console.log("setting cache in redis");
  await redis.set(CACHE_KEY, JSON.stringify(aggregated), 'EX', CACHE_TTL);

  return aggregated;
}

// aggregateTokens().then((result) => {
//   console.log("Aggregated Tokens:");
//   console.dir(result.slice(0, 5), { depth: null });
// });
