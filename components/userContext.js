import React, { createContext } from 'react';

export const userState = {
  name: '',
  firstName: '',
  lastName: '',
  address: '',
  latitude: '',
  longitude: '',
  meditationsCount: '',
  setUser: () => {},
};

export const UserContext = createContext(userState);

export function UserProvider({ children, value }) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
