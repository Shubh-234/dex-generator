const fetchDataFile = require('./fetchData');
const fetchDataDex = fetchDataFile.fetchDexScreener;
const fetchDataCoinGecko = fetchDataFile.fetchCoinGeckoSolanaTokens;

function matchTokens(dsToken: any, cgToken: any) {
  return (
    dsToken.baseToken.symbol.toLowerCase() === cgToken.symbol.toLowerCase() &&
    dsToken.baseToken.name.toLowerCase() === cgToken.name.toLowerCase()
  );
}

function aggregateTokenData(dsToken: any, cgToken: any) {
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

async function aggregateTokens() {
  const [dsPairs, cgTokens] = await Promise.all([
    fetchDataDex("solana"),
    fetchDataCoinGecko(),
  ]);

  const aggregated = [];

  for (const dsToken of dsPairs) {
    const match = cgTokens.find((cgToken: any) => matchTokens(dsToken, cgToken));
    aggregated.push(aggregateTokenData(dsToken, match));
  }

  return aggregated;
}

aggregateTokens().then((result) => {
  console.log("Aggregated Tokens:");
  console.dir(result.slice(0, 5), { depth: null });
});
