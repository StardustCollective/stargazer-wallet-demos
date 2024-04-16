import {useWeb3React} from '@web3-react/core';
import * as ethers from 'ethers';

import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

// Once activated
const {library, chainId} = useWeb3React();

export const STARGAZER_TOKEN_ADDRESSES = {
  11155111: '0xfe9885baff18074846aaa2d5541581adf068731d', // Ethereum Sepolia Testnet
  80001: '0x9994a07DD7Aa25388B3A73151EDfAf6B3d8d06D5', // Polygon Testnet
  97: '0x3Ea98D16634aB9fD01e7d749a8711736DBE95440', // BSC Testnet
  43113: '0x34f4B6A6D99Ab084EC656DCba0a10468a086CCd2' // Avalanche Fuji Testnet
};

if (library instanceof ethers.providers.Web3Provider) {
  const StargazerTokenAddress = STARGAZER_TOKEN_ADDRESSES[chainId!];

  const signer = library.getSigner();

  const contract = new ethers.Contract(StargazerTokenAddress, ERC20ABI, signer) as unknown as ERC20;

  const receiverAddress = '0x....';
  const receiveValue = ethers.utils.parseUnits('10', 18).toHexString(); // 10 SST

  const trxResponse = await contract.transfer(receiverAddress, receiveValue);

  const trxReceipt = await library.waitForTransaction(trxResponse.hash);

  console.log(trxReceipt.blockNumber);
}
