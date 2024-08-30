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

interface Metadata {
  mint?: string;
  name: string;
  uri?: string;
  symbol: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

interface IGetMintMetadataResponse extends Response {
  request_id: string;
  statusCode: number;
  data?: Metadata;
}
interface IGetMintsMetadataResponse extends Response {
  request_id: string;
  statusCode: number;
  data: Metadata[];
}
interface IGetTopPageResponse extends Response {
  request_id: string;
  statusCode: number;
  data: {
    deployed_nodes_total: number;
    tco2e_mitigated_total: number;
  };
}
const doGetMintMetada = async (
  wallet: string,
  mint: string,
  withoutAttr = false,
): Promise<IGetMintMetadataResponse> => {
  return request(
    'GET',
    API_ROUTES.COMMON.GET_MINT_METADATA,
    {
      mint,
      without_attr: withoutAttr,
    },
    {
      cache: 'no-store',
      headers: {
        ...(wallet ? { 'x-user-wallet': wallet } : {}),
      },
    },
  ) as Promise<IGetMintMetadataResponse>;
};
const doGetMintsMetada = async (
  wallet: string,
  mint: string,
  withoutAttr = false,
): Promise<IGetMintsMetadataResponse> => {
  return request(
    'GET',
    API_ROUTES.COMMON.GET_MINTS_METADATA,
    {
      mint,
      without_attr: withoutAttr,
    },
    {
      cache: 'no-store',
      headers: {
        ...(wallet ? { 'x-user-wallet': wallet } : {}),
      },
    },
  ) as Promise<IGetMintsMetadataResponse>;
};
const doGetTopPage = async (): Promise<IGetTopPageResponse> => {
  return request(
    'GET',
    API_ROUTES.COMMON.GET_TOP_PAGE,
    {},
    { cache: 'no-store' },
  ) as Promise<IGetTopPageResponse>;
};
export {
  doSendFeedback,
  doSendContact,
  doGetMintMetada,
  doGetMintsMetada,
  doGetTopPage,
};
export type {
  ISendFeedbackBody,
  TFeeling,
  ISendContactBody,
  Metadata,
  IGetTopPageResponse,
};
