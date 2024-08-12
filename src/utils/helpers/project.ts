import Big from 'big.js';

interface IListingCarbon {
  key: string;
  seller: string;
  project_id: string;
  nonce: number;
  mint: string;
  available: number;
}

const generateListingList = (
  list: IListingCarbon[],
  amount: number,
): { status: 'error' | 'success'; result: IListingCarbon[] } => {
  let currentAmount = Big(amount);
  const result: IListingCarbon[] = [];
  const availableTotal = list.reduce(
    (partialSum, info) => Big(partialSum).plus(Big(info.available)).toNumber(),
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
        key: list[i].key,
        seller: list[i].seller,
        project_id: list[i].project_id,
        nonce: list[i].nonce,
        mint: list[i].mint,
        available: Big(
          currentAmount.gte(Big(list[i].available))
            ? list[i].available
            : currentAmount.toNumber(),
        ).toNumber(),
      });
      currentAmount = currentAmount.minus(Big(list[i].available));
    }
  }
  return {
    status: 'success',
    result,
  };
};

export { generateListingList };
