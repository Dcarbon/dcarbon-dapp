import Big from 'big.js';

interface IBurningCarbon {
  name: string;
  symbol: string;
  mint: string;
  token_account: string;
  amount: number;
}

const generateBurningList = (
  list: IBurningCarbon[],
  amount: number,
): { status: 'error' | 'success'; result: IBurningCarbon[] } => {
  let currentAmount = Big(amount);
  const result: IBurningCarbon[] = [];
  const availableTotal = list.reduce(
    (partialSum, info) =>
      Big(partialSum)
        .plus(Big(info?.amount || 0))
        .toNumber(),
    0,
  );
  if (amount > availableTotal) {
    return {
      status: 'error',
      result,
    };
  }
  list.sort((a, b) => (b?.amount || 0) - (a?.amount || 0));
  for (let i = 0; i < list.length; i++) {
    if (currentAmount.toNumber() <= 0) break;
    if (list[i].amount > 0) {
      result.push({
        name: list[i]?.name,
        symbol: list[i]?.symbol,
        mint: list[i]?.mint,
        token_account: list[i]?.token_account,
        amount: Big(
          currentAmount.gte(Big(list[i]?.amount || 0))
            ? list[i]?.amount
            : currentAmount.toNumber(),
        ).toNumber(),
      });
      currentAmount = currentAmount.minus(Big(list[i]?.amount || 0));
    }
  }
  return {
    status: 'success',
    result,
  };
};

export { generateBurningList };
export type { IBurningCarbon };
