import { API_ROUTES } from '@/utils/constants';

import { request } from './xhr';

type TFeeling = 'Terrible' | 'Bad' | 'Okey' | 'Good' | 'Amazing';

interface IGetListCarbonParams {
  page?: number;
  limit?: number;
  sort_field?: string;
  sort_type?: 'asc' | 'desc';
  wallet?: string;
}

interface IGetListTxParams {
  page?: number;
  limit?: number;
  sort_field?: string;
  sort_type?: 'asc' | 'desc';
  wallet?: string;
}

interface IGetListCarbonResponse extends Response {
  request_id: string;
  statusCode: number;
  paging?: {
    total: number;
    page: number;
    limit: number;
  };
  data?: {
    name: string;
    symbol: string;
    mint: string;
    token_account: string;
    amount: number;
  }[];
  message?: string | string[];
}

interface IGetListTxResponse extends Response {
  request_id: string;
  statusCode: number;
  paging?: {
    total: number;
    page: number;
    limit: number;
  };
  data?: {
    tx: string;
    mint: string;
    amount: number;
    quality: number;
    tx_time: string;
    payment_info: {
      exchange_rate: number;
      currency: {
        mint: string;
        symbol: number;
        icon: string;
        name: string;
      };
    };
  }[];
  message?: string | string[];
}

type carbonTypes = {
  mint: string;
  token_account: string;
  name: string;
  symbol: string;
  decimals: number;
  amount: number;
  supply: number;
  description: string;
  image: string;
  freeze_authority: string;
  mint_authority: string;
};
type WalletInfoResponseTypes = {
  request_id: string;
  statusCode: number;
  paging?: {
    total: number;
    page: number;
    limit: number;
  };
  data?: {
    carbon_amount: number;
    carbon_exchange_rate: {
      amount: number;
      currency: string;
    };
    dcarbon_amount: number;
    carbon_list: carbonTypes[];
  };
  message?: string | string[];
};

type UserProfileResponseTypes = {
  statusCode: number;
  request_id: string;
  message: string;
  paging: {
    total: number;
    page: number;
    limit: number;
  };
  data: {
    name: string;
    wallet: string;
    funded: number;
    offset: number;
  };
  error: string;
};
const doGetListCarbon = async ({
  page,
  limit,
  sort_field,
  sort_type,
  wallet,
}: IGetListCarbonParams): Promise<IGetListCarbonResponse> => {
  const params = {
    ...(page ? { page } : {}),
    ...(limit ? { limit } : {}),
    ...(sort_field ? { sort_field } : {}),
    ...(sort_type ? { sort_type } : {}),
  };

  return request('GET', API_ROUTES.USER.GET_LIST_CARBON, params, {
    cache: 'no-store',
    headers: {
      ...(wallet ? { 'x-user-wallet': wallet } : {}),
    },
  }) as Promise<IGetListCarbonResponse>;
};

const doGetListTx = async ({
  page,
  limit,
  sort_field,
  sort_type,
  wallet,
}: IGetListTxParams): Promise<IGetListTxResponse> => {
  const params = {
    ...(page ? { page } : {}),
    ...(limit ? { limit } : {}),
    ...(sort_field ? { sort_field } : {}),
    ...(sort_type ? { sort_type } : {}),
  };

  return request('GET', API_ROUTES.USER.GET_LIST_TX, params, {
    cache: 'no-store',
    headers: {
      ...(wallet ? { 'x-user-wallet': wallet } : {}),
    },
  }) as Promise<IGetListTxResponse>;
};

const doGetProfile = async (
  wallet: string,
): Promise<UserProfileResponseTypes> => {
  return request('GET', API_ROUTES.USER.GET_PROFILE_INFO, undefined, {
    headers: {
      ...(wallet ? { 'x-user-wallet': wallet } : {}),
    },
  }) as Promise<UserProfileResponseTypes>;
};
const getWalletInfo = async (
  wallet: string,
): Promise<WalletInfoResponseTypes> => {
  return request('GET', API_ROUTES.USER.GET_WALLET_INFO, null, {
    headers: {
      'x-user-wallet': wallet,
    },
  }) as Promise<WalletInfoResponseTypes>;
};

export { getWalletInfo, doGetListCarbon, doGetProfile, doGetListTx };
export type {
  WalletInfoResponseTypes,
  carbonTypes,
  IGetListCarbonParams,
  TFeeling,
};
