import { API_ROUTES } from '@/utils/constants';

import { request } from './xhr';

type TFeeling = 'Terrible' | 'Bad' | 'Okey' | 'Good' | 'Amazing';

interface ISendFeedbackBody {
  feeling: TFeeling;
  name: string;
  email: string;
  description?: string;
}
interface ISendContactBody {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}
const doSendContact = async ({
  firstName,
  lastName,
  email,
  message,
}: ISendContactBody) => {
  const body = {
    first_name: firstName,
    last_name: lastName,
    email,
    message,
  };

  return request('POST', API_ROUTES.COMMON.SEND_CONTACT, body, {
    cache: 'no-store',
  });
};
const doSendFeedback = async ({
  feeling,
  name,
  email,
  description,
}: ISendFeedbackBody) => {
  const body = {
    feeling,
    name,
    email,
    ...(description ? { description } : {}),
  };

  return request('POST', API_ROUTES.COMMON.SEND_FEEDBACK, body, {
    cache: 'no-store',
  });
};

export { doSendFeedback, doSendContact };
export type { ISendFeedbackBody, TFeeling, ISendContactBody };
