import {useState, createContext} from 'react';
import {MantineProvider, Container, Grid, ScrollArea, Stack} from '@mantine/core';
import {Web3ReactProvider} from '@web3-react/core';
import cls from 'classnames';

import {getWeb3Library} from 'src/utils';
import {BaseColor} from 'src/common/consts';
import {Header} from 'src/common/components';

import {ConnectedWalletView} from 'src/views/ConnectedWalletView';
import {DemoViews} from 'src/views/DemoViews';

import styles from './App.module.scss';
import {STARGAZER_CHAINS} from './common/consts/constants';

export const NetworkContext = createContext({
  selectedChain: STARGAZER_CHAINS.ETHEREUM,
  // eslint-disable-next-line
  setSelectedChain: (_: string) => null
});

function App() {
  const [selectedChain, setSelectedChain] = useState(STARGAZER_CHAINS.ETHEREUM);
  const initialValue = {selectedChain, setSelectedChain};
  return (
    <Web3ReactProvider getLibrary={getWeb3Library}>
      <ScrollArea className={styles.mainWrapper}>
        <Header />
        <MantineProvider
          theme={{
            fontFamily: "'Rubik', sans-serif",
            headings: {fontFamily: "'Rubik', sans-serif"},
            colors: {paua: new Array(10).fill(BaseColor.PAUA) as any},
            primaryColor: 'paua'
          }}
        >
          <NetworkContext.Provider value={initialValue as any}>
            <Container fluid className={cls(styles.container)}>
              <Grid columns={7} className={styles.contained}>
                <Grid.Col span={2}>
                  <ConnectedWalletView />
                </Grid.Col>
                <Grid.Col span={5}>
                  <Stack spacing="md">
                    <DemoViews />
                  </Stack>
                </Grid.Col>
              </Grid>
            </Container>
          </NetworkContext.Provider>
        </MantineProvider>
      </ScrollArea>
    </Web3ReactProvider>
  );
}

export default App;
