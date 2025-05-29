import { SOL_TOKEN, SUNBIX_TOKEN } from '@/utils/constants';
import { useMemo } from 'react';
import { erc20Abi } from 'viem';
import { formatUnits } from 'viem';
import { useReadContracts } from 'wagmi';

const useBalances = ({ address }) => {
  const {
    isLoading,
    isError,
    data: balances,
    refetch
  } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: SOL_TOKEN,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address]
      },
      {
        address: SUNBIX_TOKEN,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address]
      }
    ]
  });

  const data = useMemo(() => {
    if (!balances) return { sol: 0, sunbix: 0 };
    return {
      sol: formatUnits(balances[0] || 0, 18) || 0,
      sunbix: formatUnits(balances[1] || 0, 18) || 0
    };
  }, [balances]);
  return { isLoading, isError, data, refetch };
};

export default useBalances;
