const baseUrl=import.meta.env.VITE_API_BASE_URL;

export const endpoints={
    auth:{
        login:`${baseUrl}/auth/login`,
        refresh:`${baseUrl}/auth/refresh`,
        logout:`${baseUrl}/auth/logout`,
    },
    user:{
        profile:`${baseUrl}/auth/profile`,
        users:`${baseUrl}/users`,
    },
    product:{
        getProduct:`${baseUrl}/products`
    }
}