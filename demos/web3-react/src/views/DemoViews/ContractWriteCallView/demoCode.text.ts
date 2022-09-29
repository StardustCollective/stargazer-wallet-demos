import {useWeb3React} from '@web3-react/core';
import * as ethers from 'ethers';

import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

// Once activated
const {library} = useWeb3React();

if (library instanceof ethers.providers.Web3Provider) {
  const StargazerGreeterAddress = '0x0F1568746563F6F1A01C76B7cfca4390d81D97b2';

  const signer = library.getSigner();

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
