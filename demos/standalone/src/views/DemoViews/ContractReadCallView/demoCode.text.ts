import * as ethers from 'ethers';

import {activateStargazerProviders} from 'src/utils';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

const {
  ethProvider,
  polygonProvider,
  bscProvider,
  avalancheProvider
} = await activateStargazerProviders();

const selectedNetwork: string = 'ethereum'; // 'ethereum' | 'polygon' | 'bsc' | 'avalanche'

const PROVIDERS = {
  ethereum: ethProvider,
  polygon: polygonProvider,
  bsc: bscProvider,
  avalanche: avalancheProvider
}

const selectedProvider = PROVIDERS[selectedNetwork];

const library = new ethers.providers.Web3Provider(selectedProvider, 'any');

const STARGAZER_GREETER_ADDRESSES = {
  ethereum: '0x0F1568746563F6F1A01C76B7cfca4390d81D97b2',
  polygon: '0xce4E723904f5a679eACB9D70710210024F62378C',
  bsc: '0x53c50ceaDc5A97F440608730d7B7D492F628c1cD',
  avalanche: '0xDc9b6Fb047268f673b4b60101A28ceCE50e0e872'
}

const StargazerGreeterAddress = STARGAZER_GREETER_ADDRESSES[selectedProvider];

const contract = new ethers.Contract(
  StargazerGreeterAddress,
  StargazerGreeterABI,
  library
) as unknown as StargazerGreeter;

const greeting = await contract.greet();

console.log(greeting);
// Bon Matin!
