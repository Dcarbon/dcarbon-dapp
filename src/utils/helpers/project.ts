import { IListingInfo } from '@adapters/project';
import Big from 'big.js';

const generateListingList = (
  list: IListingInfo[],
  amount: number,
): { status: 'error' | 'success'; result: IListingInfo[] } => {
  let currentAmount = Big(amount);
  const result: IListingInfo[] = [];
  const availableTotal = list.reduce(
    (partialSum, info) =>
      Big(partialSum)
        .plus(Big(info?.available || 0))
        .toNumber(),
    0,
  );
  if (amount > availableTotal) {
    return {
      status: 'error',
      result,
    };
  }
  list.sort((a, b) => b.available - a.available);
  for (let i = 0; i < list.length; i++) {
    if (currentAmount.toNumber() <= 0) break;
    if (list[i].available > 0) {
      result.push({
        key: list[i]?.key,
        seller: list[i]?.seller,
        project_id: list[i]?.project_id,
        nonce: list[i]?.nonce,
        mint: list[i]?.mint,
        available: Big(
          currentAmount.gte(Big(list[i]?.available || 0))
            ? list[i]?.available
            : currentAmount.toNumber(),
        ).toNumber(),
        payment_info: list[i].payment_info,
      });
      currentAmount = currentAmount.minus(Big(list[i]?.available || 0));
    }
  }
  return {
    status: 'success',
    result,
  };
};

export { generateListingList };
