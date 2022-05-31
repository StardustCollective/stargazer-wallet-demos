import {useWeb3React as useWeb3ReactHook} from '@web3-react/core';
import * as ethers from 'ethers';

const getWeb3Library = (
  provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc
): ethers.providers.Web3Provider => {
  return new ethers.providers.Web3Provider(provider, 'any');
};

const useWeb3React = (...args: Parameters<typeof useWeb3ReactHook>) =>
  useWeb3ReactHook<ethers.providers.Web3Provider>(...args);

export {getWeb3Library, useWeb3React};
