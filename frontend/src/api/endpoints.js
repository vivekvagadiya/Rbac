const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const endpoints = {
  auth: {
    login: `${baseUrl}/auth/login`,
    refresh: `${baseUrl}/auth/refresh`,
    logout: `${baseUrl}/auth/logout`,
  },
  user: {
    profile: `${baseUrl}/auth/profile`,
    users: `${baseUrl}/users`,
    createUser: `${baseUrl}/users`,
    updateUser: `${baseUrl}/users/:id`,
    deleteUser: `${baseUrl}/users/:id`,
  },
  product: {
    getProduct: `${baseUrl}/products`,
    createProduct: `${baseUrl}/products`,
    updateProduct: `${baseUrl}/products`,
    deleteProduct: `${baseUrl}/products`,
  },
  orders: {
    getOrders: `${baseUrl}/orders`,
    getOrderById: `${baseUrl}/orders/:id`,
    updateStatus: `${baseUrl}/orders/:id/status`,
    updateRefund: `${baseUrl}/orders/:id/refund`,
  },
  roles: {
    getRoles: `${baseUrl}/roles`,
    createRole: `${baseUrl}/roles/create`,
    updateRole: `${baseUrl}/roles/:id`,
  },
  permissions:{
    getPermissions:`${baseUrl}/permissions`
  }
};
