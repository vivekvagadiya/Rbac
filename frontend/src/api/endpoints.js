const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const endpoints = {
  auth: {
    login: `${baseUrl}/auth/login`,
    refresh: `${baseUrl}/auth/refresh`,
    logout: `${baseUrl}/auth/logout`,
    forgotPassword: `${baseUrl}/auth/forgot-password`,
    resetPassword: `${baseUrl}/auth/reset-password`,
  },
  user: {
    profile: `${baseUrl}/auth/profile`,
    users: `${baseUrl}/users`,
    createUser: `${baseUrl}/users`,
    updateUser: `${baseUrl}/users/:id`,
    deleteUser: `${baseUrl}/users/:id`,
    uploadPicture: `${baseUrl}/users/profile-picture`,
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
    getStatusSummary: `${baseUrl}/orders/status-summary`,
  },
  roles: {
    getRoles: `${baseUrl}/roles`,
    createRole: `${baseUrl}/roles/create`,
    updateRole: `${baseUrl}/roles/:id`,
    deleteRole: `${baseUrl}/roles/:id`,
  },
  permissions: {
    getPermissions: `${baseUrl}/permissions`,
  },
  dashboard: {
    stats: `${baseUrl}/dashboard/stats`,
    activityStats: `${baseUrl}/activity`,
  },
  payment:{
    checkout:`${baseUrl}/payments/create-checkout-session`,
    cancel:`${baseUrl}/payments/cancel-session/:sessionId`,
    verify:`${baseUrl}/payments/verify-session/:sessionId`
  }
};
