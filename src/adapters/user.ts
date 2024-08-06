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

export { doGetListCarbon };
export type { IGetListCarbonParams, TFeeling };
