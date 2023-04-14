import {useState} from 'react';
import {Textarea} from '@mantine/core';
import {StargazerConnector} from '@stardust-collective/web3-react-stargazer-connector';

import {DemoCard} from 'src/common/components';
import {useWeb3React} from 'src/utils';

import demoCodeText from './demoCode.text.ts';

const EthSignMessageView = () => {
  const {account, connector, chainId} = useWeb3React();

  const [value, setValue] = useState(
    "Sign this message to confirm your participation in this month's program."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signature, setSignature] = useState('');

  const doSignMessage = async () => {
    setLoading(true);
    setError('');
    setSignature('');

    try {
      if (connector instanceof StargazerConnector) {
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
        // Build your message
        const message = "Sign this message to confirm your participation in this month's program.";

        if (provider) {
          const signature = await provider.request({
            method: 'personal_sign',
            params: [account, message]
          });

          setSignature(signature);
          setError('');
        }
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
      title="EVM - Sign Message"
      codeExample={demoCodeText}
      actionButtonClickContent="Sign Message"
      onActionButtonClick={doSignMessage}
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
        </>
      }
      outputs={<>{signature && <Textarea label="Signature" value={signature}></Textarea>}</>}
    />
  );
};

export {EthSignMessageView};
export default EthSignMessageView;
