import {useState} from 'react';
import {TextInput, JsonInput, Textarea} from '@mantine/core';
import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';

import demoCodeText from './demoCode.text.ts';

type SignDataFeeResponse = {
  hash: string;
  feeHash?: string;
  signature: string;
  feeSignature?: string;
};

const DagSignMetagraphDataTxView = () => {
  const stargazerProviders = useStargazerProviders();

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
  const [signature, setSignature] = useState('');
  const [feeSignature, setFeeSignature] = useState('');

  const doSignMetagraphData = async () => {
    setLoading(true);
    setTransactionHash('');
    setFeeHash('');
    setSignature('');
    setFeeSignature('');
    setError('');
    try {
      const {dagProvider} = await stargazerProviders.connect();

      let parsedData: any;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        setLoading(false);
        setError('You have to provide a valid JSON object');
        return;
      }

      const response: SignDataFeeResponse = await dagProvider.request({
        method: 'dag_signMetagraphDataTransaction',
        params: [metagraphAddress, parsedData]
      });

      setTransactionHash(response.hash);
      if (response.feeHash) {
        setFeeHash(response.feeHash);
      }
      setSignature(response.signature);
      if (response.feeSignature) {
        setFeeSignature(response.feeSignature);
      }
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
      title="DAG - Sign Metagraph Data Transaction"
      codeExample={demoCodeText}
      actionButtonClickContent="Sign Metagraph Data"
      onActionButtonClick={doSignMetagraphData}
      onWalletConnected={stargazerProviders.connect}
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
              <Textarea label="Transaction hash" value={transactionHash} readOnly />
              {feeHash && <Textarea label="Fee hash" value={feeHash} readOnly />}
              <Textarea label="Signature" value={signature} readOnly />
              {feeSignature && <Textarea label="Fee signature" value={feeSignature} readOnly />}
            </>
          )}
        </>
      }
    />
  );
};

export {DagSignMetagraphDataTxView};
export default DagSignMetagraphDataTxView;
