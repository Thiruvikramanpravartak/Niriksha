export const endpoints = {
  public: {
    home: '/home',
    items: '/items',
    itemById: (id: string) => `/items/${id}`,
  },
  admin: {
    login: '/admin/auth/login',
    crud: (moduleName: string) => `/admin/${moduleName}`,
  },
  health: '/health',
} as const;
