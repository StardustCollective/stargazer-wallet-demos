import {activateStargazerProviders} from 'src/utils';

const {ethProvider} = await activateStargazerProviders();

// Build your message
const message = 'Sign this message to confirm your participation in this project.';

const accounts = await ethProvider.request({method: 'eth_accounts'});

const signature = await ethProvider.request({
  method: 'personal_sign',
  params: [accounts[0], message]
});

// Send your signature pair for further verification
const payload = {message, signature};
