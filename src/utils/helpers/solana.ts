import { Wallet } from '@solana/wallet-adapter-react';
import {
  BlockhashWithExpiryBlockHeight,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  RpcResponseAndContext,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import base58 from 'bs58';
import { env } from 'env.mjs';
import { THROW_EXCEPTION } from '@utils/constants/exception';

type TTransaction = {
  tx: VersionedTransaction;
  blockhash: RpcResponseAndContext<BlockhashWithExpiryBlockHeight>;
};

interface ISendTxOption {
  connection: Connection;
  wallet: Wallet;
  transactions: TTransaction | TTransaction[];
  transactions2?: TTransaction[];
  beforeSendTxFn?: () => Promise<void>;
}

const createTransactionV0 = async (
  connection: Connection,
  payerKey: PublicKey,
  txInstructions: TransactionInstruction | TransactionInstruction[],
  otherSigner?: Keypair[],
): Promise<{
  tx: VersionedTransaction;
  blockhash: RpcResponseAndContext<BlockhashWithExpiryBlockHeight>;
  error?: any;
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
    if (otherSigner) transactionV0.sign(otherSigner);
    return { tx: transactionV0, blockhash };
  } catch (e) {
    const error = e as Error;
    throw error;
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
  transactions2 = [] as any,
  beforeSendTxFn,
}: ISendTxOption): Promise<
  | {
      value?: {
        tx?: string;
      };
      status?: 'rejected' | 'fulfilled';
      tx?: string;
      error?: string;
    }
  | { value?: { tx?: string }; status: 'rejected' | 'fulfilled'; tx?: string }[]
> => {
  if (!connection) {
    throw new Error('connection is required');
  }

  if (!wallet) {
    throw new Error('wallet is required');
  }

  if (!transactions) {
    throw new Error('transactions is required');
  }

  if (transactions2 && !Array.isArray(transactions2)) {
    throw new Error('transactions2 must be an array');
  }

  try {
    const isMultipleTx = Array.isArray(transactions);
    const signatures = isMultipleTx
      ? await (wallet?.adapter as any)?.signAllTransactions([
          ...[...transactions, ...transactions2].map((tx) => tx.tx),
        ])
      : await (wallet?.adapter as any)?.signTransaction(transactions.tx);
    if (beforeSendTxFn) {
      await beforeSendTxFn();
    }
    if (isMultipleTx) {
      let index1 = 0;
      let index2 = 0;
      const rawTransactions1 = [];
      const rawTransactions2 = [];
      const signatures1 = signatures.slice(0, transactions.length);
      const signatures2 = signatures.slice(transactions.length);

      for await (const tran of [...transactions]) {
        rawTransactions1.push(
          createSendRawTransaction(
            connection,
            signatures1[index1],
            tran.blockhash,
            tran.tx,
          ),
        );
        index1++;
      }

      const results = await Promise.allSettled(rawTransactions1);
      const isRejected = results?.find((r) => r.status === 'rejected');

      let results2: {
        value?: { tx?: string };
        status?: 'rejected' | 'fulfilled';
      }[] = [];

      if (!isRejected) {
        for await (const tran of [...transactions2]) {
          rawTransactions2.push(
            createSendRawTransaction(
              connection,
              signatures2[index2],
              tran.blockhash,
              tran.tx,
            ),
          );
          index2++;
        }
        results2 = await Promise.allSettled(rawTransactions2);
      }

      return [...results, ...results2] as {
        value: { tx?: string };
        status: 'rejected' | 'fulfilled';
      }[];
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
    if (error?.message === THROW_EXCEPTION.USER_REJECTED_REQUEST) {
      return { tx: undefined, error: THROW_EXCEPTION.USER_REJECTED_REQUEST };
    }
    throw error;
  }
};

export { sendTx, createTransactionV0 };
