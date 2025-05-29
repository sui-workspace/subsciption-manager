import LoadingIndicator from '@/components/LoadingIndicator';
import useUser from '@/reducers/user.js';
import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAccount } from 'wagmi';


const router = createBrowserRouter([
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
