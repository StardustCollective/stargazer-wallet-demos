import {StargazerConnector} from 'stargazer-connector';

declare global {
  interface Window {
    stargazerConnector: StargazerConnector;
  }
}

const stargazerConnector = new StargazerConnector({
  supportedChainIds: [1, 3]
});

window.stargazerConnector = stargazerConnector;

export {stargazerConnector};
