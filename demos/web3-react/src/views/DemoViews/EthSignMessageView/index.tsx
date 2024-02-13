import {useState} from 'react';
import {Textarea} from '@mantine/core';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';

import {DemoCard} from 'src/common/components';
import {useWeb3React} from 'src/utils';

import demoCodeText from './demoCode.text.ts';

const EthSignMessageView = () => {
  const {account, connector} = useWeb3React();

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
      if (connector instanceof StargazerWeb3ReactConnector) {
        // Build your message
        const message = "Sign this message to confirm your participation in this month's program.";

        const signature = await connector.ethProvider.request({
          method: 'personal_sign',
          params: [account, message]
        });

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
