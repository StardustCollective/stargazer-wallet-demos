import {useWeb3React} from '@web3-react/core';
import * as ethers from 'ethers';

import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

// Once activated
const {library} = useWeb3React();

if (library instanceof ethers.providers.Web3Provider) {
  const StargazerTokenAddress = '0x4FD968a301F07dB5Dd22f4f33c0B7f4D0b91AC65';

  const contract = new ethers.Contract(
    StargazerTokenAddress,
    ERC20ABI,
    library
  ) as unknown as ERC20;

  console.log(await contract.decimals());
  // 18
}
