import {useWeb3React} from '@web3-react/core';
import {StargazerConnector} from 'stargazer-connector';

const stargazerConnector = new StargazerConnector({
  supportedChainIds: [1, 3]
});

const {activate} = useWeb3React();

await activate(stargazerConnector);
