export const USER_ROLES={
    admin: "Admin",
    manager: "Manager",
    user: "User"
}

export const getHeaderName=(path)=>{
  switch(path){
    case '/':
      return 'Dashboard';
    case '/profile':
      return 'Profile';
    case '/orders':
      return 'Orders';
    case '/products':
      return 'Products';
    case '/users':
      return 'Users';
    case '/roles':
      return 'Roles';
    case '/permissions':
      return 'Permissions';
    case '/settings':
      return 'Settings';
    default:
      return 'Dashboard';
  }
 }