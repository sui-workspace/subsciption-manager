import claimAbi from '@/services/abis/claim.json';
import { useWriteContract } from 'wagmi';

const useClaimContract = (contract) => {
  const { writeContractAsync } = useWriteContract();

  const claimHarvest = async (
    id,
    address,
    mainTokenAddress,
    subTokenAddress,
    mainAmount,
    subAmount,
    message,
    signedMessage
  ) => {
    const result = await writeContractAsync({
      address: contract,
      abi: claimAbi,
      functionName: 'claimReward',
      args: [id, address, mainTokenAddress, subTokenAddress, mainAmount, subAmount, message, signedMessage]
    });
    return result;
  };

  return { claimHarvest };
};

export default useClaimContract;
