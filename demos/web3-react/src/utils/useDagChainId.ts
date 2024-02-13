import {useState, useEffect} from 'react';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';
import {useWeb3React} from './web3-react';

const useDagChainId = () => {
  const [dagChainId, setChainId] = useState<number>();
  const {connector} = useWeb3React();

  useEffect(() => {
    if (!connector) {
      return;
    }

    const getChainId = async () => {
      if (connector instanceof StargazerWeb3ReactConnector) {
        const initialChain = await connector.dagProvider.request({
          method: 'dag_chainId',
          params: []
        });
        setChainId(initialChain);
      }
    };

    const updateChainId = (dagChainId: string) => {
      const numberChainId = parseInt(dagChainId);
      setChainId(numberChainId);
    };

    if (connector instanceof StargazerWeb3ReactConnector) {
      getChainId();
      connector.dagProvider.on('chainChanged', updateChainId);
    }
    return () => {
      if (connector instanceof StargazerWeb3ReactConnector) {
        connector.dagProvider.removeListener('chainChanged', updateChainId);
      }
    };
  }, [connector]);

  return {dagChainId};
};

export default useDagChainId;
