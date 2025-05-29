import LoadingIndicator from '@/components/LoadingIndicator';
import useWalletStore from '@/reducers/user.js';
import { createContext, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import { useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit';
import Swap from './pages/Swap';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Swap />
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
