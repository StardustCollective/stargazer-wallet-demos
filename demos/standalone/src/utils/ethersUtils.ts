import {useState} from 'react';

declare global {
  type StargazerEIPProvider = {
    request: (request: {method: string; params?: any[]}) => Promise<any>;
    on: (method: string, listener: Function) => void;
    removeListener: (method: string, listener: Function) => void;
    activate: (title?: string) => Promise<boolean>;
  };

  type StargazerEIPProviderManager = {
    version: string | number;
    getProvider: (chain: 'ethereum' | 'constellation' | 'polygon' | 'bsc') => StargazerEIPProvider;
    isConnected: () => Promise<boolean>;
    enable: () => Promise<string[]>;
  };

  type StargazerEIPWindowScope = {
    SUPPORTED_WALLET_METHODS?: Record<any, any>;
    stargazer?: StargazerEIPProviderManager | StargazerEIPProvider;
  };

  interface Window extends StargazerEIPWindowScope {}
}

/**
 * Gets and activates Stargazer (constellation, ethereum) providers
 */
const activateStargazerProviders = async () => {
  const walletProvider = window.stargazer;

  if (!walletProvider) {
    throw new Error('Unable to get wallet provider, is stargazer installed?');
  }

  if (!('getProvider' in walletProvider)) {
    throw new Error('This seems like a really old version of stargazer');
  }

  /**
   * An standard EIP-1193 Provider.
   */
  const ethProvider = walletProvider.getProvider('ethereum');
  await ethProvider.activate();

  const polygonProvider = walletProvider.getProvider('polygon');
  await polygonProvider.activate();

  const bscProvider = walletProvider.getProvider('bsc');
  await bscProvider.activate();

  /**
   * A compliant EIP-1193 Provider (JSON-RPC).
   */
  const dagProvider = walletProvider.getProvider('constellation');
  await dagProvider.activate();

  return {
    ethProvider,
    dagProvider,
    polygonProvider,
    bscProvider
  };
};

const useStargazerProviders = () => {
  const [ethProvider, setEthProvider] = useState<StargazerEIPProvider | null>(null);
  const [polygonProvider, setPolygonProvider] = useState<StargazerEIPProvider | null>(null);
  const [bscProvider, setBscProvider] = useState<StargazerEIPProvider | null>(null);
  const [dagProvider, setDagProvider] = useState<StargazerEIPProvider | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [ethAccounts, setEthAccounts] = useState<string[]>([]);
  const [dagAccounts, setDagAccounts] = useState<string[]>([]);

  const connected = ethAccounts.length !== 0 || dagAccounts.length !== 0;

  const doConnect = async () => {
    setLoading(true);
    try {
      const {ethProvider, polygonProvider, bscProvider, dagProvider} =
        await activateStargazerProviders();

      const ethAccounts = await ethProvider.request({method: 'eth_accounts', params: []});
      const dagAccounts = await dagProvider.request({method: 'dag_accounts', params: []});

      setEthProvider(ethProvider);
      setPolygonProvider(polygonProvider);
      setBscProvider(bscProvider);
      setDagProvider(dagProvider);

      setEthAccounts(ethAccounts);
      setDagAccounts(dagAccounts);

      setLoading(false);

      return {ethProvider, polygonProvider, bscProvider, ethAccounts, dagProvider, dagAccounts};
    } catch (e) {
      setLoading(false);
      setError(String(e));
      throw e;
    }
  };

  if (connected) {
    return {
      connected,
      connect: doConnect,
      error,
      loading,
      dagProvider,
      dagAccounts,
      ethProvider,
      ethAccounts,
      polygonProvider,
      bscProvider
    };
  }

  return {
    connected,
    connect: doConnect,
    error,
    loading
  };
};

export {activateStargazerProviders, useStargazerProviders};
