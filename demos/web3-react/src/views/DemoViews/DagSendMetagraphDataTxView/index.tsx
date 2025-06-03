import {useState} from 'react';
import {TextInput, JsonInput, Textarea} from '@mantine/core';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';
import {useWeb3React} from 'src/utils';
import {DemoCard} from 'src/common/components';

import demoCodeText from './demoCode.text.ts';

type SendDataFeeResponse = {
  hash: string;
  feeHash?: string;
};

const DagSendMetagraphDataTxView = () => {
  const {connector} = useWeb3React();

  const [metagraphAddress, setMetagraphAddress] = useState('');
  const [data, setData] = useState(
    JSON.stringify(
      {
        MintCollection: {
          name: 'One collection'
        }
      },
      null,
      2
    )
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [transactionHash, setTransactionHash] = useState('');
  const [feeHash, setFeeHash] = useState('');

  const doSendMetagraphData = async () => {
    setLoading(true);
    setTransactionHash('');
    setFeeHash('');
    setError('');
    try {
      if (connector instanceof StargazerWeb3ReactConnector) {
        let parsedData: any;
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          setLoading(false);
          setError('You have to provide a valid JSON object');
          return;
        }

        const response: SendDataFeeResponse = await connector.dagProvider.request({
          method: 'dag_sendMetagraphDataTransaction',
          params: [metagraphAddress, parsedData]
        });

        setTransactionHash(response.hash);
        if (response.feeHash) {
          setFeeHash(response.feeHash);
        }
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
      title="DAG - Send Metagraph Data Transaction"
      codeExample={demoCodeText}
      actionButtonClickContent="Send Metagraph Data"
      onActionButtonClick={doSendMetagraphData}
      isLoading={loading}
      error={error}
      inputs={
        <>
          <TextInput
            label="Metagraph Address"
            placeholder="DAG..."
            required
            value={metagraphAddress}
            onChange={(event) => setMetagraphAddress(event.currentTarget.value)}
          />
          <JsonInput
            label="Data"
            placeholder="Enter your JSON data"
            required
            value={data}
            onChange={setData}
            validationError="Not valid JSON"
            autosize
            formatOnBlur
            minRows={4}
          />
        </>
      }
      outputs={
        <>
          {transactionHash && (
            <>
              <Textarea label="Transaction Hash" value={transactionHash} readOnly />
              {feeHash && <Textarea label="Fee Hash" value={feeHash} readOnly />}
            </>
          )}
        </>
      }
    />
  );
};

export {DagSendMetagraphDataTxView};
export default DagSendMetagraphDataTxView;
