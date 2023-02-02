import {activateStargazerProviders} from 'src/utils';

const {dagProvider} = await activateStargazerProviders();

// Build transaction info
const txData = {
  source: 'DAG...',
  destination: 'DAG...',
  amount: 100000000, // (DATUM) 100000000 DATUM = 1 DAG
  fee: 0, // (DATUM)
};

// Send transaction
const txHash = await dagProvider.request({
  method: 'dag_sendTransaction',
  params: [txData]
});

let pendingTx;
// Keep checking the transaction status until this returns null
while (pendingTx !== null) {
  pendingTx = await dagProvider.request({
    method: 'dag_getPendingTransaction',
    params: [txHash]
  });
}

if (pendingTx === null) {
  // Check the block explorer API
  const confirmedTx = await dagProvider.request({
    method: 'dag_getTransaction',
    params: [txHash]
  });

  if (confirmedTx) {
    // Transaction confirmed
    console.log('Confirmed!', confirmedTx);
  } else {
    // The txn cannot be found on block explorer. 
    // It's a good idea to wait several seconds and try again 
    // to confirm the txn has actually been dropped.
    setTimeout(async () => {
      // Check the block explorer API again after 30 seconds
      const confirmedTx = await dagProvider.request({
        method: 'dag_getTransaction',
        params: [txHash]
      });
      if (confirmedTx) {
        console.log('Confirmed!', confirmedTx);
      } else {
        console.log('Transaction dropped - not confirmed');
      };
    }, 30000); // 30 seconds
  }
}
