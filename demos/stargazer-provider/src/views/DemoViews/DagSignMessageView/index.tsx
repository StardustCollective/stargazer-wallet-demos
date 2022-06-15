import {useState} from 'react';
import {Textarea, JsonInput} from '@mantine/core';

import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';

import demoCodeText from './demoCode.text.ts';

const DagSignMessageView = () => {
  const stargazerProviders = useStargazerProviders();

  const [value, setValue] = useState(
    'Sign this message to confirm your participation in this project.'
  );
  const [metadata, setMetadata] = useState(
    JSON.stringify({field1: 'some-value', field2: 'another value'})
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [signature, setSignature] = useState('');
  const [publicKey, setPublicKey] = useState('');

  const doSignMessage = async () => {
    let metadataValue: any;
    try {
      metadataValue = JSON.parse(metadata);
    } catch (e) {
      setError('You have to provide a valid JSON object as metadata');
      return;
    }

    setLoading(true);
    try {
      const {dagProvider, dagAccounts} = await stargazerProviders.connect();

      const signatureRequest = {
        content: value,
        metadata: metadataValue
      };

      const signatureRequestEnconded = window.btoa(JSON.stringify(signatureRequest));

      const userAddress = dagAccounts[0];

      const signature = await dagProvider.request({
        method: 'dag_signMessage',
        params: [userAddress, signatureRequestEnconded]
      });

      const publicKey = await dagProvider.request({
        method: 'dag_getPublicKey',
        params: [userAddress]
      });

      setSignature(signature);
      setPublicKey(publicKey);
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
      title="$DAG - Sign Message"
      codeExample={demoCodeText}
      actionButtonClickContent="Sign Message"
      onActionButtonClick={doSignMessage}
      onWalletConnected={stargazerProviders.connect}
      isLoading={loading}
      error={error}
      inputs={
        <>
          <Textarea
            label="Your message"
            placeholder="A cool message to sign"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
          ></Textarea>
          <JsonInput
            label="Your metadata"
            placeholder="A cool message to sign"
            value={metadata}
            onChange={setMetadata}
          ></JsonInput>
        </>
      }
      outputs={
        <>
          {signature && publicKey && (
            <>
              <Textarea label="Signature" value={signature}></Textarea>
              <Textarea label="Public Key" value={publicKey}></Textarea>
            </>
          )}
        </>
      }
    />
  );
};

export {DagSignMessageView};
export default DagSignMessageView;
