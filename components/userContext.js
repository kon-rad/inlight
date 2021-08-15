import React, { createContext } from 'react';

export const userState = {
  firstName: '',
  lastName: '',
  latitude: '',
  longitude: '',
  setUser: () => {},
};

export const UserContext = createContext(userState);

export function UserProvider({ children, value }) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
