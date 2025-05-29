import LoadingIndicator from '@/components/LoadingIndicator';
import useUser from '@/reducers/user.js';
import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAccount } from 'wagmi';

import Landing from './pages/Landing/Loadable.jsx';
import MyStake from './pages/MyStake/Loadable.jsx';
import Ref from './pages/Ref/Loadable.jsx';
import Rewards from './pages/Rewards/Loadable.jsx';
import Stake from './pages/Stake/Loadable.jsx';
import Swap from './pages/Swap/Loadable.jsx';
import Transactions from './pages/Transactions/Loadable.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/farm',
    element: <Stake />
  },
  {
    path: '/swap',
    element: <Swap />
  },
  {
    path: '/referral',
    element: <Ref />
  },
  {
    path: '/my-farm',
    element: <MyStake />
  },
  {
    path: '/my-transactions',
    element: <Transactions />
  },
  {
    path: '/referral-reward',
    element: <Rewards />
  }
]);

const App = () => {
  const { address, isConnected } = useAccount();
  const { fetchData } = useUser((state) => state);
  const [isReady, setIsReady] = useState(false);

  const loadData = async (isConnected, address) => {
    await fetchData(isConnected, address);
    setIsReady(true);
  };

  useEffect(() => {
    loadData(isConnected, address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isReady) return <LoadingIndicator />;

  return <RouterProvider router={router} />;
};

export default App;
