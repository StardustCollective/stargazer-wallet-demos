import {activateStargazerProviders} from 'src/utils';

const {
  ethProvider, 
  polygonProvider, 
  bscProvider, 
  avalancheProvider
} = await activateStargazerProviders();

const selectedNetwork: string = 'ethereum'; // 'ethereum' | 'polygon' | 'bsc' | 'avalanche'

const PROVIDERS = {
  ethereum: ethProvider,
  polygon: polygonProvider,
  bsc: bscProvider,
  avalanche: avalancheProvider
};

// Build your message
const message = 'Sign this message to confirm your participation in this project.';

const provider = PROVIDERS[selectedNetwork];

const accounts = await provider.request({method: 'eth_accounts'});

const signature = await provider.request({
  method: 'personal_sign',
  params: [message, accounts[0]]
});

// Send your signature pair for further verification
const payload = {message, signature};
