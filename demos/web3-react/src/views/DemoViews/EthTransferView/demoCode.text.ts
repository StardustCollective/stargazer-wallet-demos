import {useWeb3React} from '@web3-react/core';
import * as ethers from 'ethers';

// Once activated
const {library} = useWeb3React();

if (library instanceof ethers.providers.Web3Provider) {
  const oneGwei = ethers.BigNumber.from(1 * 1e9).toHexString();

  const signer = library.getSigner();
  const trxResponse = await signer.sendTransaction({to: '0x....', value: oneGwei});

  const trxReceipt = await library.waitForTransaction(trxResponse.hash);

  console.log(trxReceipt.blockNumber);
}
