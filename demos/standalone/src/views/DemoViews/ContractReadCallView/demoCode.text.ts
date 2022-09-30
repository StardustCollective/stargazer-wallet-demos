import * as ethers from 'ethers';

import {activateStargazerProviders} from 'src/utils';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

const {ethProvider} = await activateStargazerProviders();

const library = new ethers.providers.Web3Provider(ethProvider, 'any');

const StargazerGreeterAddress = '0x0F1568746563F6F1A01C76B7cfca4390d81D97b2';

const contract = new ethers.Contract(
  StargazerGreeterAddress,
  StargazerGreeterABI,
  library
) as unknown as StargazerGreeter;

const greeting = await contract.greet();

console.log(greeting);
// Bon Matin!
