export enum STARGAZER_CHAINS {
  CONSTELLATION = 'constellation',
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  BSC = 'bsc',
  AVALANCHE = 'avalanche',
  BASE = 'base'
}

export const STARGAZER_GREETER_ADDRESSES = {
  ethereum: '0x74299a718b2c44483a27325d7725f0b2646de3b1',
  polygon: '0x34f4B6A6D99Ab084EC656DCba0a10468a086CCd2',
  bsc: '0x53c50ceaDc5A97F440608730d7B7D492F628c1cD',
  avalanche: '0xDc9b6Fb047268f673b4b60101A28ceCE50e0e872',
  base: '0x15B7e80021219cFFFfb4a66857Fa0ec515644357'
};

export const STARGAZER_SAMPLE_TOKEN_ADDRESSES = {
  ethereum: '0xfe9885baff18074846aaa2d5541581adf068731d',
  polygon: '0xee18612b447599dBCA118443ACB99C77e765FCB6',
  bsc: '0x3Ea98D16634aB9fD01e7d749a8711736DBE95440',
  avalanche: '0x34f4B6A6D99Ab084EC656DCba0a10468a086CCd2',
  base: '0x7c9ab606354177c3c365a54392f94f10581e5926'
};

export const CHAIN_NAMES = {
  '0x1': 'Ethereum Mainnet',
  '0x5': 'Ethereum Goerli Testnet',
  '0xaa36a7': 'Ethereum Sepolia Testnet',
  '0x89': 'Polygon Mainnet',
  '0x13882': 'Polygon Amoy Testnet',
  '0x38': 'BSC Mainnet',
  '0x61': 'BSC Testnet',
  '0xa86a': 'Avalanche C-Chain',
  '0xa869': 'Avalanche Fuji Testnet',
  '0x2105': 'Base Mainnet',
  '0x14a34': 'Base Sepolia Testnet'
};

export const STARGAZER_GREETER_STRING = `Ethereum: ${STARGAZER_GREETER_ADDRESSES.ethereum}\nPolygon: ${STARGAZER_GREETER_ADDRESSES.polygon}\nBinance Smart Chain: ${STARGAZER_GREETER_ADDRESSES.bsc}\nAvalanche: ${STARGAZER_GREETER_ADDRESSES.avalanche}\nBase: ${STARGAZER_GREETER_ADDRESSES.base}\n`;
export const STARGAZER_TOKEN_STRING = `Ethereum: ${STARGAZER_SAMPLE_TOKEN_ADDRESSES.ethereum}\nPolygon: ${STARGAZER_SAMPLE_TOKEN_ADDRESSES.polygon}\nBinance Smart Chain: ${STARGAZER_SAMPLE_TOKEN_ADDRESSES.bsc}\nAvalanche: ${STARGAZER_SAMPLE_TOKEN_ADDRESSES.avalanche}\nBase: ${STARGAZER_SAMPLE_TOKEN_ADDRESSES.base}\n`;

export const ETHEREUM_TESTNET = '0xaa36a7';
export const POLYGON_TESTNET = '0x13882';
export const BSC_TESTNET = '0x61';
export const AVALANCHE_TESTNET = '0xa869';
export const BASE_TESTNET = '0x14a34';

export const ETHEREUM_CHAINS = ['0x1', '0x5', '0xaa36a7'];
export const POLYGON_CHAINS = ['0x89', '0x13882'];
export const BSC_CHAINS = ['0x38', '0x61'];
export const AVALANCHE_CHAINS = ['0xa86a', '0xa869'];
export const BASE_CHAINS = ['0x2105', '0x14a34'];

export const CHAINS_MAP = {
  [STARGAZER_CHAINS.ETHEREUM]: ETHEREUM_CHAINS,
  [STARGAZER_CHAINS.POLYGON]: POLYGON_CHAINS,
  [STARGAZER_CHAINS.BSC]: BSC_CHAINS,
  [STARGAZER_CHAINS.AVALANCHE]: AVALANCHE_CHAINS,
  [STARGAZER_CHAINS.BASE]: BASE_CHAINS
};

export const HEX_CHAINS_MAP = {
  [STARGAZER_CHAINS.ETHEREUM]: '0xaa36a7',
  [STARGAZER_CHAINS.POLYGON]: '0x13882',
  [STARGAZER_CHAINS.BSC]: '0x61',
  [STARGAZER_CHAINS.AVALANCHE]: '0xa869',
  [STARGAZER_CHAINS.BASE]: '0x14a34'
};

export const EVM_CHAINS = [
  STARGAZER_CHAINS.ETHEREUM,
  STARGAZER_CHAINS.POLYGON,
  STARGAZER_CHAINS.BSC,
  STARGAZER_CHAINS.AVALANCHE,
  STARGAZER_CHAINS.BASE
];
