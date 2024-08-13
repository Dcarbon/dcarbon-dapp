const API_ROUTES = {
  GET_MOCK: '/api/mock',
  AUTH: {
    SIGNIN: '/v1/auth/sign-in',
  },
  PROJECT: {
    LIST: '/v1/projects',
    DETAIL: '/v1/projects/[slug]',
    LISTING_INFO: '/v1/projects/[slug]/listing-info',
    QUICK_BUY_LISTING_INFO: '/v1/projects/quick-buy-listing-info',
  },
  COMMON: {
    SEND_FEEDBACK: '/v1/common/send-feedback',
  },
  USER: {
    GET_WALLET_INFO: '/v1/user/wallet-info',
    GET_LIST_CARBON: '/v1/user/list-carbon',
    GET_LIST_TX: '/v1/user/tx-list',
    GET_PROFILE_INFO: '/v1/user/profile-info',
    GENERATE_CERTIFICATE: '/v1/user/generate-certificate',
    GENERATE_NFT_METADATA: '/v1/user/generate-nft-metadata',
  },
};

const WEB_ROUTES = {
  HOME: '/',
  NOTFOUND: '/404',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/[slug]',
  PROFILE: '/profile',
};

export { API_ROUTES, WEB_ROUTES };
