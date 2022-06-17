import * as ethers from 'ethers';

import {activateStargazerProviders} from 'src/utils';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

const {ethProvider} = await activateStargazerProviders();

const library = new ethers.providers.Web3Provider(ethProvider, 'any');

const StargazerGreeterAddress = '0x1DBF94D57ceb7b59de0b5efd1e85776aa97CbDb4';

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
