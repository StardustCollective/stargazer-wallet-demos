import {useWeb3React} from '@web3-react/core';
import * as ethers from 'ethers';

import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

// Once activated
const {library, chainId} = useWeb3React();

const STARGAZER_GREETER_ADDRESSES = {
  5: '0x0F1568746563F6F1A01C76B7cfca4390d81D97b2',      // Ethereum Goerli Testnet
  80001: '0xce4E723904f5a679eACB9D70710210024F62378C',  // Polygon Testnet
  97: '0x53c50ceaDc5A97F440608730d7B7D492F628c1cD',     // Polygon Testnet
  43113: '0xDc9b6Fb047268f673b4b60101A28ceCE50e0e872'   // Avalanche Fuji Testnet
};

if (library instanceof ethers.providers.Web3Provider) {
  const StargazerGreeterAddress = STARGAZER_GREETER_ADDRESSES[chainId!];

  const contract = new ethers.Contract(
    StargazerGreeterAddress,
    StargazerGreeterABI,
    library
  ) as unknown as StargazerGreeter;

  const greeting = await contract.greet();

  console.log(greeting);
  // Bon Matin!
}
