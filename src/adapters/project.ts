import { API_ROUTES } from '@/utils/constants';

import { request } from './xhr';

const doGetProjetList = async (
  keyword?: string,
  page?: number,
  country?: string,
  location?: string,
  quantity?: '40_90' | '90_200' | '200',
) => {
  const params = {
    keyword,
    ...(page ? { page } : {}),
    ...(country ? { country } : {}),
    ...(location ? { location } : {}),
    ...(quantity ? { quantity } : {}),
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
