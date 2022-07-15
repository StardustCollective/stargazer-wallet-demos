import {useState} from 'react';
import {JsonInput, Textarea} from '@mantine/core';
import * as ethers from 'ethers';

import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';

import demoCodeText from './demoCode.text.ts';

const STRICT_DOMAIN = {
  name: 'Stargazer Demo',
  version: '1.0.0',
  chainId: 3,
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
  const stargazerProviders = useStargazerProviders();

  const [types, setTypes] = useState(JSON.stringify(DEFAULT_TYPES, null, 2));
  const [value, setValue] = useState(JSON.stringify(DEFAULT_VALUE, null, 2));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [hash, setHash] = useState('');
  const [signature, setSignature] = useState('');

  const doSignTypedData = async () => {
    setLoading(true);
    try {
      const {ethProvider} = await stargazerProviders.connect();

      const accounts = await ethProvider.request({method: 'eth_accounts', params: []});

      // Build your EIP-712 domain
      const domain = STRICT_DOMAIN;

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

      const signature = await ethProvider.request({
        method: 'eth_signTypedData',
        params: [accounts[0], messagePayload]
      });

      setHash(hash);
      setSignature(signature);

      setError('');
    } catch (e) {
      setError(String(e));
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <DemoCard
      walletRequired
      title="ETH - Sign Typed Data"
      codeExample={demoCodeText}
      actionButtonClickContent="Sign Typed Data"
      onActionButtonClick={doSignTypedData}
      onWalletConnected={stargazerProviders.connect}
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
