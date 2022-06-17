import {Alert, Title, Stack, Paper} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';

import styles from './index.module.scss';

const WalletNotesView = () => {
  return (
    <Paper shadow="xs" className={styles.main}>
      <Stack spacing="sm">
        <Title order={2}>Notes</Title>
        <Alert icon={<AlertCircle size={16} />} title="Info" color="blue">
          These demos were explicitly designed to work in a standalone fashion. Each demo handles it
          own connection to the wallet. If you wish to centralize wallet connections through your
          dapp consider using a centralized context API, in the case of react - React Context, vue -
          Provide and Inject, etc.
        </Alert>
      </Stack>
    </Paper>
  );
};

export {WalletNotesView};
