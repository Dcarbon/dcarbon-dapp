import { API_ROUTES } from '@/utils/constants';

import { request } from './xhr';

const doGetProjetList = async () => {
  return request('GET', API_ROUTES.PROJECT.LIST, undefined, {
    cache: 'no-store',
  });
};

export { doGetProjetList };
