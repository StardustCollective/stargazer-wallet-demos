import {useWeb3React} from '@web3-react/core';
import * as ethers from 'ethers';

import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

// Once activated
const {library, chainId} = useWeb3React();

const STARGAZER_GREETER_ADDRESSES = {
  11155111: '0x74299a718b2c44483a27325d7725f0b2646de3b1', // Ethereum Sepolia Testnet
  80002: '0x34f4B6A6D99Ab084EC656DCba0a10468a086CCd2', // Polygon Amoy Testnet
  97: '0x53c50ceaDc5A97F440608730d7B7D492F628c1cD', // BSC Testnet
  43113: '0xDc9b6Fb047268f673b4b60101A28ceCE50e0e872' // Avalanche Fuji Testnet
};

if (library instanceof ethers.providers.Web3Provider) {
  const signer = library.getSigner();

  const StargazerGreeterAddress = STARGAZER_GREETER_ADDRESSES[chainId!];

  const contract = new ethers.Contract(
    StargazerGreeterAddress,
    StargazerGreeterABI,
    signer
  ) as unknown as StargazerGreeter;

  const greetingId = 1; // Bon Matin!

  const trxResponse = await contract.setGreeting(greetingId);

  const trxReceipt = await library.waitForTransaction(trxResponse.hash);

  console.log(trxReceipt.blockNumber);
}
