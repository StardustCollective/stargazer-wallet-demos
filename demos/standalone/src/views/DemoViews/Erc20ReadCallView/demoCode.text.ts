import * as ethers from 'ethers';

import {activateStargazerProviders} from 'src/utils';
import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

const {ethProvider, polygonProvider} = await activateStargazerProviders();

const selectedNetwork: string = 'ethereum'; // 'ethereum' | 'polygon'

const PROVIDERS = {
  'ethereum': ethProvider,
  'polygon': polygonProvider
}

const CONTRACT_ADDRESSES = {
  'ethereum': '0x4FD968a301F07dB5Dd22f4f33c0B7f4D0b91AC65',
  'polygon': '0x9994a07DD7Aa25388B3A73151EDfAf6B3d8d06D5'
}

const selectedProvider = PROVIDERS[selectedNetwork];

const library = new ethers.providers.Web3Provider(selectedProvider, 'any');

const StargazerTokenAddress = CONTRACT_ADDRESSES[selectedNetwork];

const contract = new ethers.Contract(StargazerTokenAddress, ERC20ABI, library) as unknown as ERC20;

console.log(await contract.decimals());
// 18
