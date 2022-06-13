export const StargazerGreeterABI = [
  {
    inputs: [{internalType: 'string', name: '_greeting', type: 'string'}],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'greet',
    outputs: [{internalType: 'string', name: '', type: 'string'}],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{internalType: 'uint256', name: '_greetingId', type: 'uint256'}],
    name: 'setGreeting',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
