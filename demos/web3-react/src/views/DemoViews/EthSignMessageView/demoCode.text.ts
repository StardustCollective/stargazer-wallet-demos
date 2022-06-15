import {useWeb3React} from '@web3-react/core';
import {StargazerConnector} from 'stargazer-connector';

const stargazerConnector = new StargazerConnector({
  supportedChainIds: [1, 3]
});

// Once activated
const {connector, account} = useWeb3React();

console.log(Object.is(stargazerConnector, connector));
// true

if (connector instanceof StargazerConnector) {
  // Build your message
  const message = 'Sign this message to confirm your participation in this project.';

  const signature = await connector.ethProvider.request({
    method: 'personal_sign',
    params: [account, message]
  });

  // Send your signature pair for further verification
  const payload = {message, signature};
}
