import {useWeb3React} from '@web3-react/core';
import * as ethers from 'ethers';

import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

// Once activated
const {library, chainId} = useWeb3React();

export const STARGAZER_TOKEN_ADDRESSES = {
  11155111: '0xfe9885baff18074846aaa2d5541581adf068731d', // Ethereum Sepolia Testnet
  80002: '0xee18612b447599dBCA118443ACB99C77e765FCB6', // Polygon Amoy Testnet
  97: '0x3Ea98D16634aB9fD01e7d749a8711736DBE95440', // BSC Testnet
  43113: '0x34f4B6A6D99Ab084EC656DCba0a10468a086CCd2', // Avalanche Fuji Testnet
  84532: '0x7c9ab606354177c3c365a54392f94f10581e5926' // Base Sepolia Testnet
};

if (library instanceof ethers.providers.Web3Provider) {
  const StargazerTokenAddress = STARGAZER_TOKEN_ADDRESSES[chainId!];

  const contract = new ethers.Contract(
    StargazerTokenAddress,
    ERC20ABI,
    library
  ) as unknown as ERC20;

  console.log(await contract.decimals());
  // 18
}
