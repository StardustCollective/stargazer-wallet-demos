import {useWeb3React} from '@web3-react/core';
import * as ethers from 'ethers';

import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

// Once activated
const {library, chainId} = useWeb3React();

export const STARGAZER_TOKEN_ADDRESSES = {
  5: '0x4FD968a301F07dB5Dd22f4f33c0B7f4D0b91AC65',      // Ethereum Goerli Testnet
  80001: '0x9994a07DD7Aa25388B3A73151EDfAf6B3d8d06D5',  // Polygon Testnet
  97: '0x3Ea98D16634aB9fD01e7d749a8711736DBE95440',     // BSC Testnet
  43113: '0x34f4B6A6D99Ab084EC656DCba0a10468a086CCd2'   // Avalanche Fuji Testnet
};

if (library instanceof ethers.providers.Web3Provider) {
  const StargazerTokenAddress = STARGAZER_TOKEN_ADDRESSES[chainId!];

  const signer = library.getSigner();

  const contract = new ethers.Contract(StargazerTokenAddress, ERC20ABI, signer) as unknown as ERC20;

  const spenderAddress = '0x....';
  const spendValue = ethers.utils.parseUnits('10', 18).toHexString(); // 10 SST

  const trxResponse = await contract.approve(spenderAddress, spendValue);

  const trxReceipt = await library.waitForTransaction(trxResponse.hash);

  console.log(trxReceipt.blockNumber);
}
