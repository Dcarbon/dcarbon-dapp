import { Wallet } from '@solana/wallet-adapter-react';
import {
  BlockhashWithExpiryBlockHeight,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  RpcResponseAndContext,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import base58 from 'bs58';
import { env } from 'env.mjs';

type TTransaction = {
  tx: VersionedTransaction;
  blockhash: RpcResponseAndContext<BlockhashWithExpiryBlockHeight>;
};

interface ISendTxOption {
  connection: Connection;
  wallet: Wallet;
  transactions: TTransaction | TTransaction[];
}

const createTransactionV0 = async (
  connection: Connection,
  payerKey: PublicKey,
  txInstructions: TransactionInstruction | TransactionInstruction[],
): Promise<{
  tx: VersionedTransaction;
  blockhash: RpcResponseAndContext<BlockhashWithExpiryBlockHeight>;
} | null> => {
  if (!txInstructions) {
    throw new Error('txInstructions is required');
  }

  if (!payerKey) {
    throw new Error('payerKey is required');
  }

  if (!connection) {
    throw new Error('connection is required');
  }

  try {
    const blockhash =
      await connection.getLatestBlockhashAndContext('confirmed');
    const setComputeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: Number(env.NEXT_PUBLIC_COMPUTE_UNIT_PRICE || 100000),
    });
    const messageV0 = new TransactionMessage({
      payerKey,
      recentBlockhash: blockhash.value.blockhash,
      instructions: [
        setComputeUnitPriceIx,
        ...(Array.isArray(txInstructions) ? txInstructions : [txInstructions]),
      ],
    }).compileToV0Message();
    const transactionV0 = new VersionedTransaction(messageV0);
    return { tx: transactionV0, blockhash };
  } catch (e) {
    const error = e as Error;
    throw error?.stack || error?.message;
  }
};

const createSendRawTransaction = async (
  connection: Connection,
  signature: VersionedTransaction,
  blockhash: RpcResponseAndContext<BlockhashWithExpiryBlockHeight>,
  transaction: VersionedTransaction,
): Promise<{
  tx?: string;
}> => {
  if (!connection) {
    throw new Error('connection is required');
  }
  if (!signature) {
    throw new Error('signature is required');
  }
  if (!blockhash) {
    throw new Error('blockhash is required');
  }
  if (!transaction) {
    throw new Error('transaction is required');
  }
  let tx: string | undefined;
  const signatureEncode = base58.encode(signature?.signatures?.[0]);
  const blockHeight = await connection.getBlockHeight({
    commitment: 'confirmed',
    minContextSlot: blockhash.context.slot,
  });
  const transactionTTL = blockHeight + 151;
  const waitToConfirm = () =>
    new Promise((resolve) => setTimeout(resolve, 5000));
  const waitToRetry = () => new Promise((resolve) => setTimeout(resolve, 2000));

  const numTry = 30;
  let isShoError = false;
  for (let i = 0; i < numTry; i++) {
    // check transaction TTL
    const blockHeight = await connection.getBlockHeight('confirmed');
    if (blockHeight >= transactionTTL) {
      throw new Error('ONCHAIN_TIMEOUT');
    }

    const data = await connection.simulateTransaction(transaction, {
      replaceRecentBlockhash: true,
      commitment: 'confirmed',
    });
    if (
      !isShoError &&
      env.NEXT_PUBLIC_SKIP_PREFLIGHT === '1' &&
      data?.value?.err
    ) {
      isShoError = true;
      console.error('SimulateTransaction Error', data?.value?.logs);
    }

    await connection?.sendRawTransaction(signature.serialize(), {
      skipPreflight: env.NEXT_PUBLIC_SKIP_PREFLIGHT === '1',
      maxRetries: 0,
      preflightCommitment: 'confirmed',
    });

    await waitToConfirm();

    const sigStatus = await connection.getSignatureStatus(signatureEncode);
    tx = signatureEncode;
    if (sigStatus.value?.err) {
      if (env.NEXT_PUBLIC_SKIP_PREFLIGHT === '1') {
        console.error('GetSignatureStatus Error', data?.value?.logs);
      }
      throw new Error('UNKNOWN_TRANSACTION');
    }
    if (sigStatus.value?.confirmationStatus === 'confirmed') {
      break;
    }

    await waitToRetry();
  }
  return {
    tx,
  };
};

const sendTx = async ({
  connection,
  wallet,
  transactions,
}: ISendTxOption): Promise<{
  tx?: string;
}> => {
  if (!connection) {
    throw new Error('connection is required');
  }

  if (!wallet) {
    throw new Error('wallet is required');
  }

  if (!transactions) {
    throw new Error('transactions is required');
  }

  try {
    const isMultipleTx = Array.isArray(transactions);
    const signatures = isMultipleTx
      ? await (wallet?.adapter as any)?.signAllTransactions(
          transactions?.map((tx) => tx.tx),
        )
      : await (wallet?.adapter as any)?.signTransaction(transactions);

    if (isMultipleTx) {
      let index = 0;
      const rawTransactions = [];
      for await (const tran of transactions) {
        rawTransactions.push(
          createSendRawTransaction(
            connection,
            signatures[index],
            tran.blockhash,
            tran.tx,
          ),
        );
        index++;
      }

      const results = (await Promise.allSettled(rawTransactions)) as any;
      return results;
    } else {
      return await createSendRawTransaction(
        connection,
        signatures,
        transactions.blockhash,
        transactions.tx,
      );
    }
  } catch (e) {
    const error = e as Error;
    throw error?.stack || error?.message;
  }
};

export { sendTx, createTransactionV0 };
