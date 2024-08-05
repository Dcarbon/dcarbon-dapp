import { API_ROUTES } from '@/utils/constants';

import { request } from './xhr';

type TFeeling = 'Terrible' | 'Bad' | 'Okey' | 'Good' | 'Amazing';

interface ISendFeedbackBody {
  feeling: TFeeling;
  name: string;
  email: string;
  description?: string;
}

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

export { doSendFeedback };
export type { ISendFeedbackBody, TFeeling };
