import {Badge} from '@mantine/core';
import {useState} from 'react';

import {DemoCard} from 'src/common/components';
import {useStargazerProviders} from 'src/utils';

import demoCodeText from './demoCode.text.ts';

const ConnectWalletView = () => {
  const stargazerProviders = useStargazerProviders();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const doActivate = async () => {
    setLoading(true);

    try {
      stargazerProviders.connect();
    } catch (e) {
      setError(String(e));
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
      outputs={
        <>
          {stargazerProviders.connected &&
            stargazerProviders.dagAccounts.map((account) => <Badge key={account}>{account}</Badge>)}
          {stargazerProviders.connected &&
            stargazerProviders.ethAccounts.map((account) => <Badge key={account}>{account}</Badge>)}
        </>
      }
    />
  );
};

export {ConnectWalletView};

export default ConnectWalletView;
