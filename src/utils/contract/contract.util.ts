import { CARBON_IDL } from '@contracts/carbon/carbon.idl';
import { ICarbonContract } from '@contracts/carbon/carbon.interface';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { MPL_TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { AnchorWallet, Wallet } from '@solana/wallet-adapter-react';
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
} from '@solana/web3.js';
import { ShowAlert } from '@components/common/toast';
import { createTransactionV0, sendTx } from '@utils/helpers/solana';

interface IConnectOption {
  program?: Program<ICarbonContract>;
  connection: Connection;
  anchorWallet: AnchorWallet;
  wallet: Wallet;
  signer: PublicKey;
}

interface IMintNftOption {
  amount: number;
  uri: string;
  beforeSendTxFn?: () => Promise<void>;
}

const mintNft = async (
  { program, connection, anchorWallet, wallet, signer }: IConnectOption,
  { amount, uri, beforeSendTxFn }: IMintNftOption,
) => {
  if (!program) {
    const provider = new AnchorProvider(connection, anchorWallet);
    program = new Program<ICarbonContract>(
      CARBON_IDL as ICarbonContract,
      provider,
    );
  }
  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    MPL_TOKEN_METADATA_PROGRAM_ID.toString(),
  );
  const [collectionPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('Collection')],
    program.programId,
  );
  const [collectionMetadataPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata', 'utf8'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      collectionPDA.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  );
  const [collectionMasterEditionPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata', 'utf8'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      collectionPDA.toBuffer(),
      Buffer.from('edition', 'utf8'),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  );
  const nftMint = Keypair.generate();
  const tokenAccount = getAssociatedTokenAddressSync(nftMint.publicKey, signer);
  const [metadataAccount] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata', 'utf8'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      nftMint.publicKey.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  );
  const [masterEditionPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata', 'utf8'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      nftMint.publicKey.toBuffer(),
      Buffer.from('edition', 'utf8'),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  );
  const mintNftIns = await program.methods
    .mintNft(uri, 'DCO2 Certificate', 'DCC', amount)
    .accounts({
      signer,
      collectionMetadataAccount: collectionMetadataPDA,
      collectionMasterEdition: collectionMasterEditionPDA,
      nftMint: nftMint.publicKey,
      metadataAccount: metadataAccount,
      masterEdition: masterEditionPDA,
      tokenAccount: tokenAccount,
    })
    .instruction();
  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 300_000,
  });
  const mintTxVer0 = await createTransactionV0(
    connection,
    signer,
    [modifyComputeUnits, mintNftIns],
    [nftMint],
  );
  if (!mintTxVer0) {
    ShowAlert.dismiss('loading');
    ShowAlert.error({
      message: 'Failed to create mint transaction!',
    });
    return;
  }
  const result = (await sendTx({
    connection,
    wallet,
    transactions: mintTxVer0,
    beforeSendTxFn,
  })) as {
    tx?: string;
    error?: any;
  };
  return result;
};

export { mintNft };
