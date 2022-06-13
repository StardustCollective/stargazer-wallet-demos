import {MantineProvider, Container, Grid, ScrollArea, Stack} from '@mantine/core';
import cls from 'classnames';

import {BaseColor} from 'src/common/consts';
import {Header} from 'src/common/components';

import {WalletNotesView} from 'src/views/WalletNotesView';
import {DemoViews} from 'src/views/DemoViews';

import styles from './App.module.scss';

function App() {
  return (
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
              <WalletNotesView />
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
  );
}

export default App;
