import { API_ROUTES } from '@/utils/constants';
import { Metadata } from '@adapters/common';
import { EMintingStatus } from '@enums/burn.enum';

import { request } from './xhr';

type TFeeling = 'Terrible' | 'Bad' | 'Okey' | 'Good' | 'Amazing';

type TBurnStatus = 'finished' | 'rejected' | 'error' | 'minting';

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
    image?: string;
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

interface IGetListBurnTxResponse extends Response {
  request_id: string;
  statusCode: number;
  paging?: {
    total: number;
    page: number;
    limit: number;
  };
  data?: {
    group_tx: string;
    amount: number;
    txs: string[];
    metadata_uri?: string;
    metadata?: Metadata;
    status: EMintingStatus;
    tx_time?: string;
    mint_tx?: string;
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
    metadata: Metadata;
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

const doGetListBurnTx = async ({
  page,
  limit,
  sort_field,
  sort_type,
  wallet,
}: IGetListTxParams): Promise<IGetListBurnTxResponse> => {
  const params = {
    ...(page ? { page } : {}),
    ...(limit ? { limit } : {}),
    ...(sort_field ? { sort_field } : {}),
    ...(sort_type ? { sort_type } : {}),
  };

  return request('GET', API_ROUTES.USER.GET_LIST_BURN_TX, params, {
    cache: 'no-store',
    headers: {
      ...(wallet ? { 'x-user-wallet': wallet } : {}),
    },
  }) as Promise<IGetListBurnTxResponse>;
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
  transactions: string[];
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
    transactions,
    owner,
    date,
    amount,
    project_name,
  }: IGenerateCertificatetaBody,
): Promise<IGenerateCertificateResponse> => {
  const body = {
    transactions,
    owner,
    date,
    amount,
    ...(project_name ? { project_name } : {}),
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
    asset_type?: 'sFT' | 'FT';
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

const doModifyBurnHistoryStatus = async ({
  info,
  status,
  group_tx,
  mint_tx,
}: {
  info?: {
    tx: string;
    status: TBurnStatus;
  }[];
  group_tx?: string;
  status?: TBurnStatus;
  mint_tx?: string;
}) => {
  const body = {
    info,
    status,
    group_tx,
    mint_tx,
  };
  return request('POST', API_ROUTES.USER.MODIFY_BURN_HISTORY_STATUS, body, {
    cache: 'no-store',
  });
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
  doModifyBurnHistoryStatus,
  doGetListBurnTx,
};
export type {
  WalletInfoResponseTypes,
  carbonTypes,
  IGetListCarbonParams,
  TFeeling,
  IGetListCarbonResponse,
  IGetCertificateDetailResponse,
  IGetListBurnTxResponse,
  TBurnStatus,
};
