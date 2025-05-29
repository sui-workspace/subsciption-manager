import { SWAP_CONTRACT } from '@/utils/constants';
import { erc20Abi } from 'viem';
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

const useAllowance = (owner, tokenAddress, contract = SWAP_CONTRACT) => {
  const { data: allowance, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [owner, contract]
  });
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function approve() {
    writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [contract, '115792089237316195423570985008687907853269984665640564039457584007913129639935']
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash
  });
  return { allowance, error, approve, isConfirmed, isLoading: isPending || isConfirming, refetch };
};

export default useAllowance;
