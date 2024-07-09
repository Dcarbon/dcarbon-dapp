import { API_ROUTES } from '@/utils/constants';

import { request } from './xhr';

const doSignIn = async (email: string, password: string) => {
  const body = {
    username: email,
    password,
  };
  return request('POST', API_ROUTES.AUTH.SIGNIN, body);
};

export { doSignIn };
