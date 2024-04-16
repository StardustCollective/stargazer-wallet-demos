import {useState} from 'react';
import {Textarea, JsonInput, Switch} from '@mantine/core';
import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';

import demoCodeText from './demoCode.text.ts';

const DagSignDataView = () => {
  const stargazerProviders = useStargazerProviders();

  const [checked, setChecked] = useState(true);
  const [string, setString] = useState('This is a custom string.');
  const [object, setObject] = useState(
    JSON.stringify(
      {
        field1: 'content_field_1',
        field2: {
          field2_1: true,
          field2_2: 12332435,
          field2_3: {
            field2_3_1: 'content_field2_3_1'
            // Nested fields are supported
          }
        },
        field3: [1, 2, 3, 4],
        field4: null
      },
      null,
      2
    )
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [signature, setSignature] = useState('');
  const [publicKey, setPublicKey] = useState('');

  const doSignData = async () => {
    setLoading(true);
    setSignature('');
    setPublicKey('');
    setError('');
    try {
      const {dagProvider, dagAccounts} = await stargazerProviders.connect();

      let data: any;

      if (checked) {
        // JSON object
        try {
          data = JSON.parse(object);
          if (data) {
            data = JSON.stringify(data);
          }
        } catch (e) {
          setLoading(false);
          setError('You have to provide a valid JSON object');
          return;
        }
      } else {
        data = string;
      }

      const dataEncoded = window.btoa(data);

      const userAddress = dagAccounts[0];

      const signature = await dagProvider.request({
        method: 'dag_signData',
        params: [userAddress, dataEncoded]
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

  const onChangeSwitch = (event) => {
    setChecked(event.currentTarget.checked);
  };

  return (
    <DemoCard
      walletRequired
      title="$DAG - Sign Data"
      codeExample={demoCodeText}
      actionButtonClickContent="Sign Data"
      onActionButtonClick={doSignData}
      onWalletConnected={stargazerProviders.connect}
      isLoading={loading}
      error={error}
      inputs={
        <>
          <Switch
            checked={checked}
            onChange={onChangeSwitch}
            size="md"
            radius="md"
            color="violet"
            label="Custom JSON object"
          />
          <Textarea
            label="Your custom string"
            placeholder="A cool message to sign"
            value={string}
            disabled={checked}
            onChange={(event) => setString(event.currentTarget.value)}
          ></Textarea>
          <JsonInput
            label="Your custom JSON object"
            placeholder="A cool message to sign"
            value={object}
            onChange={setObject}
            validationError="Not valid JSON"
            autosize
            disabled={!checked}
            formatOnBlur
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

export {DagSignDataView};
export default DagSignDataView;
