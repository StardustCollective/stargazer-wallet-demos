import {MantineProvider, Container, Grid, ScrollArea, Stack} from '@mantine/core';
import {Web3ReactProvider} from '@web3-react/core';
import cls from 'classnames';

import {getWeb3Library} from 'src/utils';
import {BaseColor} from 'src/common/consts';
import {Header} from 'src/common/components';

import {ConnectedWalletView} from 'src/views/ConnectedWalletView';
import {DemoViews} from 'src/views/DemoViews';

import styles from './App.module.scss';

function App() {
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
        </MantineProvider>
      </ScrollArea>
    </Web3ReactProvider>
  );
}

export default App;
