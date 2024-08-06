import { PublicKey } from '@solana/web3.js';
import chalk from 'chalk';
import clsx, { ClassValue } from 'clsx';
import { SweetAlertOptions } from 'sweetalert2';
import { Cache } from 'swr';
import { twMerge } from 'tailwind-merge';

function isEmpty(obj: Array<any> | object): boolean {
  if (!obj || typeof obj !== 'object') return !obj;

  if (Array.isArray(obj)) {
    return !obj.length;
  }

  return !Object.keys(obj).length;
}

function removeUndefinedAndNull(obj: Object) {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (
      obj[key as keyof Object] !== undefined &&
      obj[key as keyof Object] !== null
    ) {
      result[key as any] = obj[key as keyof Object];
    }
  }

  return result;
}

const getSweetErrorConfig = (message: string): SweetAlertOptions => {
  return {
    icon: 'error',
    title: message,
    width: 600,
    padding: '3em',
    color: '#716add',
    backdrop: `
            rgba(0,0,123,0.4)
            url("/images/common/nyan-cat.gif")
            left top
            no-repeat
        `,
  };
};

const logger = ({
  message,
  type,
}: {
  message: string;
  type: 'ERROR' | 'INFO';
}) => {
  switch (type) {
    case 'ERROR':
      console.error(chalk.red(message));
      break;

    default:
      console.info(chalk.blue(message));
      break;
  }
};

const getInfoDevice = () => {
  const device = /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)
    ? 'MOBILE'
    : 'DESKTOP';
  const collapsed = device !== 'DESKTOP';

  return {
    device,
    collapsed,
  } as const;
};

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

const getAllCacheDataByKey = (
  key: string,
  cache: Cache<any>,
  pick: string,
): any[] => {
  const keys = Array.from(cache.keys());
  const targetKeys = keys.filter((k) => k.includes(key));
  const result: any = [];
  targetKeys.forEach((k) => {
    const data = cache.get(k);
    if (data?.data) {
      result.push(...(data.data?.[pick] || []));
    }
  });

  return result;
};

const shortAddress = (
  type: 'text' | 'address',
  address?: string | PublicKey,
) => {
  if (!address) {
    return '';
  }
  let result = '';
  if (type === 'address') {
    result =
      ((address as PublicKey)?.toBase58()?.slice(0, 5) || '') +
      '...' +
      ((address as PublicKey)?.toBase58()?.slice(-5) || '');
  }

  if (type === 'text') {
    result =
      ((address as string)?.slice(0, 5) || '') +
      '...' +
      ((address as string)?.slice(-5) || '');
  }

  return result;
};

export {
  removeUndefinedAndNull,
  isEmpty,
  getSweetErrorConfig,
  logger,
  getInfoDevice,
  cn,
  currencyFormatter,
  getAllCacheDataByKey,
  shortAddress,
};
