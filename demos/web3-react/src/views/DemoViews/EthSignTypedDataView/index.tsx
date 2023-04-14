import {useState} from 'react';
import {JsonInput, Textarea} from '@mantine/core';
import * as ethers from 'ethers';
import {StargazerConnector} from '@stardust-collective/web3-react-stargazer-connector';

import {DemoCard} from 'src/common/components';
import {useWeb3React} from 'src/utils';

import demoCodeText from './demoCode.text.ts';

const STRICT_DOMAIN = {
  name: 'Stargazer Demo',
  version: '1.0.0',
  chainId: 5,
  verifyingContract: '0xEb14c9bb6C2DEc2eCb9B278C9fa1EC763B04d545'
};

const DEFAULT_TYPES = {
  DeviceControl: [
    {name: 'principal', type: 'AuthorizedEntity'},
    {name: 'emergency', type: 'AuthorizedEntity'}
  ],
  AuthorizedEntity: [
    {name: 'address', type: 'address'},
    {name: 'validUntil', type: 'uint256'}
  ]
};

const DEFAULT_VALUE = {
  principal: {
    address: '0xEb14c9bb6C2DEc2eCb9B278C9fa1EC763B04d545',
    validUntil: 1657823568
  },
  emergency: {
    address: '0xcAc3DA343670aBB46BC6E8e6d375B66217519093',
    validUntil: 1752517998
  }
};

const EthSignMessageView = () => {
  const {account, connector, chainId} = useWeb3React();

  const [types, setTypes] = useState(JSON.stringify(DEFAULT_TYPES, null, 2));
  const [value, setValue] = useState(JSON.stringify(DEFAULT_VALUE, null, 2));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [hash, setHash] = useState('');
  const [signature, setSignature] = useState('');

  const doSignTypedData = async () => {
    setLoading(true);
    setError('');
    setHash('');
    setSignature('');

    try {
      if (connector instanceof StargazerConnector) {
        // Build your EIP-712 domain
        const domain = {
          ...STRICT_DOMAIN,
          chainId
        };

        // Build your EIP-712 types
        const typesParsed = JSON.parse(types);

        // Build your EIP-712 value / message
        const valueParsed = JSON.parse(value);

        // We are using ethers to build a EIP-712 payload from our domain, types and value.
        const messagePayload = ethers.utils._TypedDataEncoder.getPayload(
          domain,
          typesParsed,
          valueParsed
        );

        const hash = ethers.utils._TypedDataEncoder.hash(domain, typesParsed, valueParsed);

        const CHAIN_ID_TO_PROVIDER = {
          1: connector.ethProvider,
          5: connector.ethProvider,
          137: connector.polygonProvider,
          80001: connector.polygonProvider,
          56: connector.bscProvider,
          97: connector.bscProvider,
          43114: connector.avalancheProvider,
          43113: connector.avalancheProvider
        };

        const provider = CHAIN_ID_TO_PROVIDER[chainId!];

        const signature = await provider.request({
          method: 'eth_signTypedData',
          params: [account, messagePayload]
        });

        setHash(hash);
        setSignature(signature);

        setError('');
      }
    } catch (e) {
      setError(String(e));
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <DemoCard
      walletRequired
      title="EVM - Sign Typed Data"
      codeExample={demoCodeText}
      actionButtonClickContent="Sign Typed Data"
      onActionButtonClick={doSignTypedData}
      isLoading={loading}
      error={error}
      inputs={
        <>
          <JsonInput
            label="Your EIP-712 domain (RO)"
            value={JSON.stringify(STRICT_DOMAIN, null, 2)}
            readOnly
            autosize
          ></JsonInput>
          <JsonInput
            label="Your EIP-712 types"
            value={types}
            onChange={setTypes}
            validationError="Not valid JSON"
            autosize
            formatOnBlur
          ></JsonInput>
          <JsonInput
            label="Your EIP-712 data"
            value={value}
            onChange={setValue}
            validationError="Not valid JSON"
            autosize
            formatOnBlur
          ></JsonInput>
        </>
      }
      outputs={
        <>
          {hash && <Textarea label="Hash" value={hash}></Textarea>}
          {signature && <Textarea label="Signature" value={signature}></Textarea>}
        </>
      }
    />
  );
};

export {EthSignMessageView};
export default EthSignMessageView;
