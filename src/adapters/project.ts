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
    listing_carbon?: {
      key: string;
      seller: string;
      project_id: string;
      nonce: number;
      mint: string;
      available: 6.4;
    }[];
  };
  message?: string | string[];
}

interface IListingInfo {
  key: string;
  seller: string;
  project_id: string;
  nonce: number;
  mint: string;
  available: number;
  payment_info?: {
    currency: string;
    exchange_rate: number;
  };
}

interface IGetQuickBuyListingInfoResponse extends Response {
  request_id: string;
  statusCode: number;
  data?: {
    available_carbon: number;
    listing_carbon?: IListingInfo[];
    spl_tokens: {
      id: string;
      mint: string;
      symbol: string;
      name: string;
      icon: string;
      is_stable: boolean;
    }[];
  };
  message?: string | string[];
}
interface IGetChartResponse extends Response {
  request_id: string;
  statusCode: number;
  data: {
    project_model?: string;
    device_info?: {
      paging: {
        page: number;
        limit: number;
        total: number;
      };
      devices?: {
        device_name: string;
        device_id: string;
        is_active: boolean;
        is_selected: boolean;
        last_mint: string;
      }[];
    };
    carbon_minted?: {
      data: number[];
      labels: string[];
    };
    wood_burned?: {
      data: number[];
      labels: string[];
    };
  };
}
type GetCarbonMintedRequest = {
  type: 'all_data' | 'device_data' | 'minted_data';
  device_id?: string;
  devices_page?: number;
  devices_limit?: number;
};
type GetWoodBurnedRequest = {
  type: 'all_data' | 'device_data' | 'wood_burned_data';
  device_id?: string;
  devices_page?: number;
  devices_limit?: number;
};
interface IGetProjectDocumentResponse extends Response {
  request_id: string;
  statusCode: number;
  paging: {
    total: number;
    page: number;
    limit: number;
  };
  data: {
    document_id: string;
    document_name: string;
    document_type: string;
    document_path: string;
    created_at: string;
  }[];
}
interface IGetProjectListingInfoByMintResponse extends Response {
  request_id: string;
  statusCode: number;
  data: {
    id: string;
    slug: string;
    manager_id: string;
    destination_wallet: string;
    project_name: string;
    description: string;
    thumbnail: string;
    images: string[];
    country: string;
    location: {
      name: string;
      iframe: string;
      latitude: number;
      longitude: number;
    };
    location_name: string;
    power: number;
    spec: {};
    status: string;
    country_name: string;
    iot_models: {
      id: string;
      model_name: string;
    }[];
    type: {
      id: number;
      name: string;
    };
    manager: {
      id: string;
      ref_code: string;
      user_name: string;
      profile_name: string;
      wallet: string;
      role: string;
      info: string;
      status: string;
    };
    po_wallet: string;
    implementation_date: string;
    mints: string[];
  }[];
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

const doGetQuickBuyListingInfo = async (
  iot_model?: 'PrjT_G' | 'PrjT_E' | 'PrjT_S',
): Promise<IGetQuickBuyListingInfoResponse> => {
  return request(
    'GET',
    API_ROUTES.PROJECT.QUICK_BUY_LISTING_INFO,
    { iot_model },
    {
      cache: 'no-store',
    },
  ) as Promise<IGetQuickBuyListingInfoResponse>;
};
const doGetCarbonMinted = async (
  slug: string,
  data: GetCarbonMintedRequest,
): Promise<IGetChartResponse> => {
  return request(
    'GET',
    API_ROUTES.PROJECT.CARBON_MINTED_DASHBOARD.replace('[slug]', slug),
    data,
    {
      cache: 'no-store',
    },
  ) as Promise<IGetChartResponse>;
};
const doGetWoodBurned = async (
  slug: string,
  data: GetWoodBurnedRequest,
): Promise<IGetChartResponse> => {
  return request(
    'GET',
    API_ROUTES.PROJECT.WOOD_BURNED_DASHBOARD.replace('[slug]', slug),
    data,
    {
      cache: 'no-store',
    },
  ) as Promise<IGetChartResponse>;
};
const doGetProjectDocuments = async (
  slug: string,
  page?: number,
): Promise<IGetProjectDocumentResponse> => {
  return request(
    'GET',
    API_ROUTES.PROJECT.DOCUMENTS.replace('[slug]', slug),
    { page: page },
    {
      cache: 'no-store',
    },
  ) as Promise<IGetProjectDocumentResponse>;
};

const doGetProjectInfoByMint = async (
  mint: string,
): Promise<IGetProjectListingInfoByMintResponse> => {
  return request(
    'GET',
    API_ROUTES.PROJECT.PROJECT_INFO_BY_MINT,
    { ids: mint },
    {
      cache: 'no-store',
    },
  ) as Promise<IGetProjectListingInfoByMintResponse>;
};
export {
  doGetProjetList,
  doGetProjectDetail,
  doGetProjectListingInfo,
  doGetQuickBuyListingInfo,
  doGetCarbonMinted,
  doGetWoodBurned,
  doGetProjectDocuments,
  doGetProjectInfoByMint,
};

export type {
  IGetProjectListingInfoResponse,
  IListingInfo,
  GetCarbonMintedRequest,
  GetWoodBurnedRequest,
};
