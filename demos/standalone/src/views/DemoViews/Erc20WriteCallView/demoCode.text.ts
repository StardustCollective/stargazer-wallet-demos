import * as ethers from 'ethers';

import {activateStargazerProviders} from 'src/utils';
import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

const {ethProvider} = await activateStargazerProviders();

const library = new ethers.providers.Web3Provider(ethProvider, 'any');

const StargazerTokenAddress = '0x4FD968a301F07dB5Dd22f4f33c0B7f4D0b91AC65';

const signer = library.getSigner();

const contract = new ethers.Contract(StargazerTokenAddress, ERC20ABI, signer) as unknown as ERC20;

const spenderAddress = '0x....';
const spendValue = ethers.utils.parseUnits('10', 18).toHexString(); // 10 SST

const trxResponse = await contract.approve(spenderAddress, spendValue);

const trxReceipt = await library.waitForTransaction(trxResponse.hash);

console.log(trxReceipt.blockNumber);
