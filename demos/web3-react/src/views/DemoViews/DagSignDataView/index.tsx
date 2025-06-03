import {useState} from 'react';
import {Textarea, JsonInput, Switch} from '@mantine/core';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';
import {DemoCard} from 'src/common/components';
import {useWeb3React} from 'src/utils';

import demoCodeText from './demoCode.text.ts';

const DagSignDataView = () => {
  const {connector} = useWeb3React();

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
      if (connector instanceof StargazerWeb3ReactConnector) {
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

        const userAddress = connector.dagAccounts[0];

        const signature = await connector.dagProvider.request({
          method: 'dag_signData',
          params: [userAddress, dataEncoded]
        });

        const publicKey = await connector.dagProvider.request({
          method: 'dag_getPublicKey',
          params: [userAddress]
        });

        setSignature(signature);
        setPublicKey(publicKey);
        setError('');
      }
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
      title="DAG - Sign Data"
      codeExample={demoCodeText}
      actionButtonClickContent="Sign Data"
      onActionButtonClick={doSignData}
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
