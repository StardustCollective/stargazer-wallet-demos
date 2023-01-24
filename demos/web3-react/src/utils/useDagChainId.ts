import {useState, useEffect} from 'react';
import {StargazerConnector} from '@stardust-collective/web3-react-stargazer-connector';
import {useWeb3React} from './web3-react';

const useDagChainId = () => {
  const [dagChainId, setChainId] = useState<number>();
  const {connector} = useWeb3React();

  useEffect(() => {
    if (!connector) {
      return;
    }

    const getChainId = async () => {
      if (connector instanceof StargazerConnector) {
        const initialChain = await connector.dagProvider.request({
          method: 'dag_chainId',
          params: []
        });
        setChainId(initialChain);
      }
    };

    const updateChainId = (dagChainId: number) => {
      setChainId(dagChainId);
    };

    if (connector instanceof StargazerConnector) {
      getChainId();
      connector.dagProvider.on('chainChanged', updateChainId);
    }
    return () => {
      if (connector instanceof StargazerConnector) {
        connector.dagProvider.removeListener('chainChanged', updateChainId);
      }
    };
  }, [connector]);

  return {dagChainId};
};

export default useDagChainId;
