const API_ROUTES = {
  GET_MOCK: '/api/mock',
  AUTH: {
    SIGNIN: '/v1/auth/sign-in',
  },
  PROJECT: {
    LIST: '/v1/projects',
    DETAIL: '/v1/projects/[slug]',
  },
};

const WEB_ROUTES = {
  HOME: '/',
  NOTFOUND: '/404',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/[slug]',
};

export { API_ROUTES, WEB_ROUTES };
