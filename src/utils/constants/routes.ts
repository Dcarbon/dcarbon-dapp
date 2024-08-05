const API_ROUTES = {
  GET_MOCK: '/api/mock',
  AUTH: {
    SIGNIN: '/v1/auth/sign-in',
  },
  PROJECT: {
    LIST: '/v1/projects',
    DETAIL: '/v1/projects/[slug]',
  },
  COMMON: {
    SEND_FEEDBACK: '/v1/common/send-feedback',
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
