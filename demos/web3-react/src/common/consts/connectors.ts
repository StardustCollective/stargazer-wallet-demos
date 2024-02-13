import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';

declare global {
  interface Window {
    stargazerConnector: StargazerWeb3ReactConnector;
  }
}

const stargazerConnector = new StargazerWeb3ReactConnector({});

window.stargazerConnector = stargazerConnector;

export {stargazerConnector};
