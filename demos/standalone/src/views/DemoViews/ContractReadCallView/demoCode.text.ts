import * as ethers from 'ethers';

import {activateStargazerProviders} from 'src/utils';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

const {ethProvider, polygonProvider} = await activateStargazerProviders();

const selectedNetwork: string = 'ethereum'; // 'ethereum' | 'polygon'

const PROVIDERS = {
  'ethereum': ethProvider,
  'polygon': polygonProvider
}

const selectedProvider = PROVIDERS[selectedNetwork];

const library = new ethers.providers.Web3Provider(selectedProvider, 'any');

const CONTRACT_ADDRESSES = {
  'ethereum': '0x0F1568746563F6F1A01C76B7cfca4390d81D97b2',
  'polygon': '0x0F1568746563F6F1A01C76B7cfca4390d81D97b2'
}

const StargazerGreeterAddress = CONTRACT_ADDRESSES[selectedProvider];

const contract = new ethers.Contract(
  StargazerGreeterAddress,
  StargazerGreeterABI,
  library
) as unknown as StargazerGreeter;

const greeting = await contract.greet();

console.log(greeting);
// Bon Matin!
