import * as ethers from 'ethers';

import {activateStargazerProviders} from 'src/utils';
import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

const {ethProvider} = await activateStargazerProviders();

const library = new ethers.providers.Web3Provider(ethProvider, 'any');

const StargazerTokenAddress = '0x6235bFcC2eb5401932A03e043C9b7De4eDCe7A2f';

const contract = new ethers.Contract(StargazerTokenAddress, ERC20ABI, library) as unknown as ERC20;

console.log(await contract.decimals());
// 18
