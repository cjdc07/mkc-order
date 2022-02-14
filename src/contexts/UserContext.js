import * as React from 'react';
import { AUTH_STATUS } from '../constants';
import useAuth from '../hooks/useAuth';

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [authStatus, setAuthStatus] = React.useState(AUTH_STATUS.CHECKING);
  const { check } = useAuth();

  React.useEffect(() => {
    check()
      .then(user => {
        setUser(user);
        setAuthStatus(AUTH_STATUS.AUTHENTICATED);
      })
      .catch(() => {
        setUser(null);
        setAuthStatus(AUTH_STATUS.UNAUTHENTICATED);
        localStorage.removeItem('access_token');
      });
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, authStatus }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
