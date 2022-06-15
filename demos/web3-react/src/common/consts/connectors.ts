import {StargazerConnector} from 'stargazer-connector';

declare global {
  interface Window {
    stargazerConnector: StargazerConnector;
  }
}

const stargazerConnector = new StargazerConnector({});

window.stargazerConnector = stargazerConnector;

export {stargazerConnector};
