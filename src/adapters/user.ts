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

interface IGetListCertificateParams extends IGetListTxParams {}

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
  common?: {
    total: number;
    all_data: {
      name: string;
      symbol: string;
      mint: string;
      token_account: string;
      amount: number;
    }[];
  };
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

interface IGetListCertificateResponse extends Response {
  statusCode: number;
  request_id: string;
  message?: string;
  paging?: {
    total: number;
    page: number;
    limit: number;
  };
  data?: {
    created_at: string;
    address: string;
    name: string;
    symbol: string;
    metadata: {
      name: string;
      symbol: string;
      image: string;
      description: string;
      attributes: {
        trait_type: string;
        value: string;
      }[];
    };
  }[];

  error?: string;
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

const doGetListCertificate = async ({
  page,
  limit,
  sort_field,
  sort_type,
  wallet,
}: IGetListCertificateParams): Promise<IGetListCertificateResponse> => {
  const params = {
    ...(page ? { page } : {}),
    ...(limit ? { limit } : {}),
    ...(sort_field ? { sort_field } : {}),
    ...(sort_type ? { sort_type } : {}),
  };

  return request('GET', API_ROUTES.USER.GET_LIST_CERTIFICATE, params, {
    cache: 'no-store',
    headers: {
      ...(wallet ? { 'x-user-wallet': wallet } : {}),
    },
  }) as Promise<IGetListCertificateResponse>;
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
      ...(wallet ? { 'x-user-wallet': wallet } : {}),
    },
    cache: 'no-store',
  }) as Promise<WalletInfoResponseTypes>;
};

interface IGenerateCertificatetaBody {
  project_location: string;
  transaction_id: string;
  owner: string;
  date: number;
  amount: number;
  project_name: string;
}

interface IGenerateCertificateResponse extends Response {
  request_id: string;
  statusCode: number;
  paging?: {
    total: number;
    page: number;
    limit: number;
  };
  data?: {
    url: string;
  };
  message?: string | string[];
}
const doGenerateBurnMetadata = async (
  wallet: string,
  {
    project_location,
    transaction_id,
    owner,
    date,
    amount,
    project_name,
  }: IGenerateCertificatetaBody,
): Promise<IGenerateCertificateResponse> => {
  const body = {
    project_location,
    transaction_id,
    owner,
    date,
    amount,
    project_name,
  };
  return request('POST', API_ROUTES.USER.GENERATE_CERTIFICATE, body, {
    headers: {
      ...(wallet ? { 'x-user-wallet': wallet } : {}),
    },
    cache: 'no-store',
  }) as Promise<IGenerateCertificateResponse>;
};

type TGenerateNftMetadataAtributes = {
  trait_type: string;
  value: string;
};
interface IGenerateNftMetadataBody {
  name: string;
  symbol: string;
  description?: string;
  image: string;
  attributes?: TGenerateNftMetadataAtributes[];
}

interface IGenerateNftMetadataResponse extends Response {
  request_id: string;
  statusCode: number;
  paging?: {
    total: number;
    page: number;
    limit: number;
  };
  data?: {
    uri: string;
  };
  message?: string | string[];
}

const doGenerateNftMetadata = async (
  wallet: string,
  { name, symbol, description, image, attributes }: IGenerateNftMetadataBody,
): Promise<IGenerateNftMetadataResponse> => {
  const body = {
    name,
    symbol,
    ...(description ? { description } : {}),
    image,
    ...(attributes ? { attributes } : {}),
  };
  return request('POST', API_ROUTES.USER.GENERATE_NFT_METADATA, body, {
    cache: 'no-store',
    headers: {
      ...(wallet ? { 'x-user-wallet': wallet } : {}),
    },
  }) as Promise<IGenerateNftMetadataResponse>;
};

interface IGetCertificateDetailResponse extends Response {
  request_id: string;
  statusCode: number;
  paging?: {
    total: number;
    page: number;
    limit: number;
  };
  data?: {
    name?: string;
    burned_at?: string;
    burn_tx?: string[];
    amount?: string;
    project_name?: string;
  };
  message?: string | string[];
}

const doGetCertificateDetail = async (
  mint: string,
): Promise<IGetCertificateDetailResponse> => {
  return request(
    'GET',
    API_ROUTES.USER.GET_CERTIFICATE_DETAIL.replace('[mint]', mint || ''),
    null,
    {
      cache: 'no-store',
    },
  ) as Promise<IGetCertificateDetailResponse>;
};

export {
  getWalletInfo,
  doGetListCarbon,
  doGenerateBurnMetadata,
  doGenerateNftMetadata,
  doGetListTx,
  doGetProfile,
  doGetListCertificate,
  doGetCertificateDetail,
};
export type {
  WalletInfoResponseTypes,
  carbonTypes,
  IGetListCarbonParams,
  TFeeling,
  IGetListCarbonResponse,
  IGetCertificateDetailResponse,
};
