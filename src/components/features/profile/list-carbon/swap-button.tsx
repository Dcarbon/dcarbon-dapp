'use client';

import React, { useEffect, useState } from 'react';
import { IGetListCarbonResponse } from '@/adapters/user';
import { CARBON_IDL } from '@/contracts/carbon/carbon.idl';
import { ICarbonContract } from '@/contracts/carbon/carbon.interface';
import { generateBurningList } from '@/utils/helpers/profile';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { useDisclosure } from '@nextui-org/react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Big from 'big.js';
import { KeyedMutator } from 'swr';

import DCarbonButton from '../../../common/button';
import SwapModal from './swap-modal';

function SwapButton({
  allMints,
  mints,
  mutate,
  reset,
}: {
  allMints: any[];
  mints?: { mint: string; amount: number }[];
  mutate: KeyedMutator<IGetListCarbonResponse | null>;
  reset: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [manualAmount, setManualAmount] = useState<string>('');
  const [newAllMints, setNewAllMints] = useState<any[]>([]);
  const [newMints, setNewMints] = useState<{ mint: string; amount: number }[]>(
    [],
  );
  const [newAmount, setNewAmount] = useState<number>();
  const [newMaxAmount, setNewMaxAmount] = useState<number>(0);
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  useEffect(() => {
    const init = async () => {
      if (!anchorWallet || !connection) return;
      const provider = new AnchorProvider(connection, anchorWallet);
      const program = new Program<ICarbonContract>(
        CARBON_IDL as ICarbonContract,
        provider,
      );
      const [configContract] = PublicKey.findProgramAddressSync(
        [Buffer.from('contract_config')],
        program.programId,
      );
      const configData =
        await program.account.contractConfig.fetch(configContract);

      const mintFt = configData.mint;
      const newAllMints2 = allMints.filter(
        (mint) => mint?.mint !== mintFt.toBase58(),
      );
      const newMints2 = mints?.filter(
        (mint) => mint.mint !== mintFt.toBase58(),
      );

      const newAmount2 = newMints2?.reduce((acc, curr) => {
        acc = Big(acc || 0).add(Big(curr?.amount || 0));
        return acc;
      }, Big(0));

      const newMaxAmount2 = newAllMints2.reduce((acc, curr) => {
        acc = Big(acc || 0).add(Big(curr?.amount || 0));
        return acc;
      }, Big(0));
      setNewAmount(newAmount2?.toNumber() || 0);
      setNewMaxAmount(newMaxAmount2.toNumber() || 0);
      setNewAllMints(newAllMints2);
      setNewMints(newMints2 || []);
    };
    init();
  }, [allMints, anchorWallet, connection, mints]);
  return (
    <>
      <DCarbonButton
        color="primary"
        variant="bordered"
        className="min-w-[150px] h-[34px]"
        onClick={onOpen}
      >
        Swap
      </DCarbonButton>

      <SwapModal
        isOpen={isOpen}
        onClose={onClose}
        allMints={newAllMints || []}
        amount={newAmount || 0}
        mints={
          newAmount
            ? newMints
            : generateBurningList(
                newAllMints,
                Big(manualAmount || 0).toNumber(),
              ).result || []
        }
        manualAmount={manualAmount}
        setManualAmount={setManualAmount}
        maxAmount={newMaxAmount}
        mutate={mutate}
        reset={reset}
      />
    </>
  );
}

export default SwapButton;
