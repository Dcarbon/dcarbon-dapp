import { API_ROUTES } from '@/utils/constants';

import { request } from './xhr';

interface IGetProjectListingInfoResponse extends Response {
  request_id: string;
  statusCode: number;
  paging?: {
    total: number;
    page: number;
    limit: number;
  };
  data?: {
    available_carbon: number;
    payment_info: {
      currency: {
        name: string;
        symbol: string;
        mint: string;
        icon: string;
      };
      exchange_rate: number;
    };
  };
  message?: string | string[];
}

const doGetProjetList = async ({
  keyword,
  page,
  country,
  location,
  quantity,
  iot_model,
}: {
  keyword?: string;
  page?: number;
  country?: string;
  location?: string;
  quantity?: 'PrjU_Smal' | 'PrjU_None' | 'PrjU_Medium' | 'PrjU_Large';
  iot_model?: 'PrjT_G' | 'PrjT_E' | 'PrjT_S';
}) => {
  const params = {
    keyword,
    ...(page ? { page } : {}),
    ...(country ? { country } : {}),
    ...(location ? { location } : {}),
    ...(quantity ? { quantity } : { quantity: 'PrjU_None' }),
    ...(iot_model ? { iot_model } : {}),
  };

  return request('GET', API_ROUTES.PROJECT.LIST, params, {
    cache: 'no-store',
  });
};

const doGetProjectDetail = async (slug: string) => {
  return request(
    'GET',
    API_ROUTES.PROJECT.DETAIL.replace('[slug]', slug),
    undefined,
    {
      cache: 'no-store',
    },
  );
};

const doGetProjectListingInfo = async (
  slug: string,
): Promise<IGetProjectListingInfoResponse> => {
  return request(
    'GET',
    API_ROUTES.PROJECT.LISTING_INFO.replace('[slug]', slug),
    undefined,
    {
      cache: 'no-store',
    },
  ) as Promise<IGetProjectListingInfoResponse>;
};

export { doGetProjetList, doGetProjectDetail, doGetProjectListingInfo };

export type { IGetProjectListingInfoResponse };
