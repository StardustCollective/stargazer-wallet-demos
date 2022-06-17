import * as ethers from 'ethers';

import {activateStargazerProviders} from 'src/utils';

const {ethProvider} = await activateStargazerProviders();

const library = new ethers.providers.Web3Provider(ethProvider, 'any');

const oneGwei = ethers.BigNumber.from(1 * 1e9).toHexString();

const signer = library.getSigner();

const trxResponse = await signer.sendTransaction({to: '0x....', value: oneGwei});

const trxReceipt = await library.waitForTransaction(trxResponse.hash);

console.log(trxReceipt.blockNumber);
