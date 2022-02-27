import * as React from 'react';
import { AUTH_STATUS } from '../constants';
import useAuth from '../hooks/useAuth';

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [authStatus, setAuthStatus] = React.useState(AUTH_STATUS.CHECKING);
  const { check } = useAuth();

  const handleAuthCheck = async () => {
    try {
      const user = await check();
      setUser(user);
      setAuthStatus(AUTH_STATUS.AUTHENTICATED);
    } catch (err) {
      if (user !== null && localStorage.getItem('access_token') !== null) {
        window.location.reload();
      }
      
      setUser(null);
      setAuthStatus(AUTH_STATUS.UNAUTHENTICATED);
      localStorage.removeItem('access_token');
    }
  }

  React.useEffect(() => {
    handleAuthCheck();
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, authStatus, handleAuthCheck }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
