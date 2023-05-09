export enum STARGAZER_CHAINS {
  CONSTELLATION = 'constellation',
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  BSC = 'bsc',
  AVALANCHE = 'avalanche'
}

export const STARGAZER_GREETER_ADDRESSES = {
  ethereum: '0x0F1568746563F6F1A01C76B7cfca4390d81D97b2',
  polygon: '0xce4E723904f5a679eACB9D70710210024F62378C',
  bsc: '0x53c50ceaDc5A97F440608730d7B7D492F628c1cD',
  avalanche: '0xDc9b6Fb047268f673b4b60101A28ceCE50e0e872'
};

export const STARGAZER_SAMPLE_TOKEN_ADDRESSES = {
  ethereum: '0x4FD968a301F07dB5Dd22f4f33c0B7f4D0b91AC65',
  polygon: '0x9994a07DD7Aa25388B3A73151EDfAf6B3d8d06D5',
  bsc: '0x3Ea98D16634aB9fD01e7d749a8711736DBE95440',
  avalanche: '0x34f4B6A6D99Ab084EC656DCba0a10468a086CCd2'
};

export const STARGAZER_GREETER_STRING = `Ethereum: ${STARGAZER_GREETER_ADDRESSES.ethereum}\nPolygon: ${STARGAZER_GREETER_ADDRESSES.polygon}\nBinance Smart Chain: ${STARGAZER_GREETER_ADDRESSES.bsc}\nAvalanche: ${STARGAZER_GREETER_ADDRESSES.avalanche}\n`;
export const STARGAZER_TOKEN_STRING = `Ethereum: ${STARGAZER_SAMPLE_TOKEN_ADDRESSES.ethereum}\nPolygon: ${STARGAZER_SAMPLE_TOKEN_ADDRESSES.polygon}\nBinance Smart Chain: ${STARGAZER_SAMPLE_TOKEN_ADDRESSES.bsc}\nAvalanche: ${STARGAZER_SAMPLE_TOKEN_ADDRESSES.avalanche}\n`;

export const ETHEREUM_TESTNET = '0x5';
export const POLYGON_TESTNET = '0x13881';
export const BSC_TESTNET = '0x61';
export const AVALANCHE_TESTNET = '0xa869';

export const ETHEREUM_CHAINS = ['0x1', '0x5'];
export const POLYGON_CHAINS = ['0x89', '0x13881'];
export const BSC_CHAINS = ['0x38', '0x61'];
export const AVALANCHE_CHAINS = ['0xa86a', '0xa869'];

export const CHAINS_MAP = {
  [STARGAZER_CHAINS.ETHEREUM]: ETHEREUM_CHAINS,
  [STARGAZER_CHAINS.POLYGON]: POLYGON_CHAINS,
  [STARGAZER_CHAINS.BSC]: BSC_CHAINS,
  [STARGAZER_CHAINS.AVALANCHE]: AVALANCHE_CHAINS
};

export const EVM_CHAINS = [
  STARGAZER_CHAINS.ETHEREUM,
  STARGAZER_CHAINS.POLYGON,
  STARGAZER_CHAINS.BSC,
  STARGAZER_CHAINS.AVALANCHE
];
