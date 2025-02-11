import React, { createContext, useContext } from 'react';
import { Provider } from 'react-redux';
import storeAlert from '@/redux/store-alert';

const StoreContext = createContext({ storeAlert });

const MultiStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StoreContext.Provider value={{ storeAlert }}>
      <Provider store={storeAlert}>
        {children}
        {/* <Provider store={storeAuth}>{children}</Provider> */}
      </Provider>
    </StoreContext.Provider>
  );
};

export const useMultiStore = () => {
  return useContext(StoreContext);
};

export default MultiStoreProvider;
