import * as ethers from 'ethers';
import {activateStargazerProviders} from 'src/utils';

const {ethProvider} = await activateStargazerProviders();

const selectedNetwork: string = 'ethereum'; // 'ethereum' | 'polygon' | 'bsc' | 'avalanche'

const TEST_CHAIN_IDS = {
  ethereum: 11155111, // Sepolia
  polygon: 80002, // Polygon Amoy testnet
  bsc: 97, // BSC testnet
  avalanche: 43113, // Fuji testnet
  base: 84532 // Base Sepolia Testnet
};

const chainId = TEST_CHAIN_IDS[selectedNetwork];

// Build your EIP-712 domain
const domain = {
  name: 'Stargazer Demo',
  version: '1.0.0',
  chainId,
  verifyingContract: '0xabcdefABCDEF1234567890abcdefABCDEF123456'
};

// Build your EIP-712 types
const types = {
  DeviceControl: [
    {name: 'principal', type: 'AuthorizedEntity'},
    {name: 'emergency', type: 'AuthorizedEntity'}
  ],
  AuthorizedEntity: [
    {name: 'address', type: 'address'},
    {name: 'validUntil', type: 'uint256'}
  ]
};

// Build your EIP-712 value / message
const value = {
  principal: {
    address: '0xEb14c9bb6C2DEc2eCb9B278C9fa1EC763B04d545',
    validUntil: 1657823568
  },
  emergency: {
    address: '0xcAc3DA343670aBB46BC6E8e6d375B66217519093',
    validUntil: 1752517998
  }
};

// We are using ethers to build a EIP-712 payload from our domain, types and value.
const messagePayload = ethers.utils._TypedDataEncoder.getPayload(domain, types, value);

const accounts = await ethProvider.request({method: 'eth_accounts'});

const signature = await ethProvider.request({
  method: 'eth_signTypedData',
  params: [accounts[0], messagePayload]
});

// Send your signature pair for further verification
const payload = {messagePayload, signature};
