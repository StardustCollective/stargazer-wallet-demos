import {useState} from 'react';

import {DemoCard} from 'src/common/components';
import {useWeb3React} from 'src/utils';
import {stargazerConnector} from 'src/common/consts';

import demoCodeText from './demoCode.text.ts';

const ConnectWalletView = () => {
  const {activate} = useWeb3React();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const doActivate = async () => {
    setLoading(true);

    try {
      await activate(stargazerConnector, undefined, true);
    } catch (e) {
      if (e instanceof Error && /providers are not available/i.test(e.message)) {
        setError('Seems Stargazer is not installed or available');
      }
      console.error(e);
    }

    setLoading(false);
  };

  return (
    <DemoCard
      title="Connect Wallet"
      codeExample={demoCodeText}
      actionButtonClickContent={'Connect Wallet'}
      onActionButtonClick={doActivate}
      isLoading={loading}
      error={error}
    />
  );
};

export {ConnectWalletView};

export default ConnectWalletView;
