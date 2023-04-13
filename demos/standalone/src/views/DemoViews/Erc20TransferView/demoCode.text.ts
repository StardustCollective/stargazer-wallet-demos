import * as ethers from 'ethers';

import {activateStargazerProviders} from 'src/utils';
import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

const {ethProvider, polygonProvider, bscProvider} = await activateStargazerProviders();

const selectedNetwork: string = 'ethereum'; // 'ethereum' | 'polygon' | 'bsc'

const PROVIDERS = {
  'ethereum': ethProvider,
  'polygon': polygonProvider,
  'bsc': bscProvider
}

const CONTRACT_ADDRESSES = {
  'ethereum': '0x4FD968a301F07dB5Dd22f4f33c0B7f4D0b91AC65',
  'polygon': '0x9994a07DD7Aa25388B3A73151EDfAf6B3d8d06D5',
  'bsc': '0x3Ea98D16634aB9fD01e7d749a8711736DBE95440'
}

const selectedProvider = PROVIDERS[selectedNetwork];

const library = new ethers.providers.Web3Provider(selectedProvider, 'any');

const StargazerTokenAddress = CONTRACT_ADDRESSES[selectedNetwork];

const signer = library.getSigner();

const contract = new ethers.Contract(StargazerTokenAddress, ERC20ABI, signer) as unknown as ERC20;

const receiverAddress = '0x....';
const receiveValue = ethers.utils.parseUnits('10', 18).toHexString(); // 10 SST

const trxResponse = await contract.transfer(receiverAddress, receiveValue);

const trxReceipt = await library.waitForTransaction(trxResponse.hash);

console.log(trxReceipt.blockNumber);
