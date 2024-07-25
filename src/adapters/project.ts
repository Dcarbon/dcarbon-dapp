import { API_ROUTES } from '@/utils/constants';

import { request } from './xhr';

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
  quantity?: '40_90' | '90_200' | '200' | '1_20' | '20_100' | '100';
  iot_model?: 'PrjT_G' | 'PrjT_E' | 'PrjT_S';
}) => {
  const params = {
    keyword,
    ...(page ? { page } : {}),
    ...(country ? { country } : {}),
    ...(location ? { location } : {}),
    ...(quantity ? { quantity } : {}),
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

export { doGetProjetList, doGetProjectDetail };
