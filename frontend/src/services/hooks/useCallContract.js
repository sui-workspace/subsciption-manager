import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

const useCallContract = (contract, abi) => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function call(functionName, args) {
    writeContract({
      address: contract,
      abi,
      functionName: functionName,
      args
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash
  });

  return { call, isPending, isConfirming, isConfirmed, error, hash };
};

export default useCallContract;
