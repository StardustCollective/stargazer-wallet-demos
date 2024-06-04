import * as ethers from 'ethers';

import {activateStargazerProviders} from 'src/utils';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

const {ethProvider} = await activateStargazerProviders();

const selectedNetwork: string = 'ethereum'; // 'ethereum' | 'polygon' | 'bsc' | 'avalanche'

const library = new ethers.providers.Web3Provider(ethProvider, 'any');

const STARGAZER_GREETER_ADDRESSES = {
  ethereum: '0x74299a718b2c44483a27325d7725f0b2646de3b1',
  polygon: '0x34f4B6A6D99Ab084EC656DCba0a10468a086CCd2',
  bsc: '0x53c50ceaDc5A97F440608730d7B7D492F628c1cD',
  avalanche: '0xDc9b6Fb047268f673b4b60101A28ceCE50e0e872'
};

const StargazerGreeterAddress = STARGAZER_GREETER_ADDRESSES[selectedNetwork];

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
