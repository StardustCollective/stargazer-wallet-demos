import * as ethers from 'ethers';

import {activateStargazerProviders} from 'src/utils';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

const {ethProvider} = await activateStargazerProviders();

const library = new ethers.providers.Web3Provider(ethProvider, 'any');

const StargazerGreeterAddress = '0x1DBF94D57ceb7b59de0b5efd1e85776aa97CbDb4';

const contract = new ethers.Contract(
  StargazerGreeterAddress,
  StargazerGreeterABI,
  library
) as unknown as StargazerGreeter;

const greeting = await contract.greet();

console.log(greeting);
// Bon Matin!
