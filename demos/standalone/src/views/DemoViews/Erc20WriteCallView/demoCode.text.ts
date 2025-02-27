import * as ethers from 'ethers';

import {activateStargazerProviders} from 'src/utils';
import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

const {ethProvider} = await activateStargazerProviders();

const selectedNetwork: string = 'ethereum'; // 'ethereum' | 'polygon' | 'bsc' | 'avalanche'

const STARGAZER_SAMPLE_TOKEN_ADDRESSES = {
  ethereum: '0xfe9885baff18074846aaa2d5541581adf068731d',
  polygon: '0xee18612b447599dBCA118443ACB99C77e765FCB6',
  bsc: '0x3Ea98D16634aB9fD01e7d749a8711736DBE95440',
  avalanche: '0x34f4B6A6D99Ab084EC656DCba0a10468a086CCd2',
  base: '0x7c9ab606354177c3c365a54392f94f10581e5926'
};

const library = new ethers.providers.Web3Provider(ethProvider, 'any');

const StargazerTokenAddress = STARGAZER_SAMPLE_TOKEN_ADDRESSES[selectedNetwork];

const signer = library.getSigner();

const contract = new ethers.Contract(StargazerTokenAddress, ERC20ABI, signer) as unknown as ERC20;

const spenderAddress = '0x....';
const spendValue = ethers.utils.parseUnits('10', 18).toHexString(); // 10 SST

const trxResponse = await contract.approve(spenderAddress, spendValue);

const trxReceipt = await library.waitForTransaction(trxResponse.hash);

console.log(trxReceipt.blockNumber);
