import {useWeb3React} from '@web3-react/core';
import * as ethers from 'ethers';

import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

// Once activated
const {library} = useWeb3React();

if (library instanceof ethers.providers.Web3Provider) {
  const StargazerGreeterAddress = '0x0F1568746563F6F1A01C76B7cfca4390d81D97b2';

  const contract = new ethers.Contract(
    StargazerGreeterAddress,
    StargazerGreeterABI,
    library
  ) as unknown as StargazerGreeter;

  const greeting = await contract.greet();

  console.log(greeting);
  // Bon Matin!
}
