import { useEffect } from 'react';
import { formatUnits, parseUnits } from 'viem';

import stakeAbi from '../abis/stake.json';
import useAllowance from './useAllowance';
import useCallContract from './useCallContract';

const useStake = ({ pool, address, amount, subAmount, setIsLoading }) => {
  const {
    allowance: allowanceMain,
    approve: approveMain,
    error: errorApproveMain,
    isConfirmed: isConfirmedMain
  } = useAllowance(address, pool?.mainTokenAddress, pool?.stakeContractAddress);
  const {
    allowance: allowanceSub,
    approve: approveSub,
    error: errorApproveSub,
    isConfirmed: isConfirmedSub
  } = useAllowance(address, pool?.subTokenAddress, pool?.stakeContractAddress);

  const { call: callStake, isConfirmed, error, hash } = useCallContract(pool?.stakeContractAddress, stakeAbi);

  async function call() {
    try {
      if (formatUnits(allowanceMain || 0, 18) >= amount && formatUnits(allowanceSub || 0, 18) >= subAmount) {
        await callStake('stakeMain', [parseUnits(amount?.toString() || '0', 18)]);
      }
      if (formatUnits(allowanceMain || 0, 18) <= amount) {
        await approveMain();
      }
      if (formatUnits(allowanceMain || 0, 18) >= amount && formatUnits(allowanceSub || 0, 18) <= subAmount) {
        await approveSub();
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (errorApproveMain || errorApproveSub) {
      setIsLoading(false);
    }
  }, [errorApproveMain, errorApproveSub, setIsLoading]);

  useEffect(() => {
    if (isConfirmedMain) {
      if (formatUnits(allowanceSub || 0, 18) >= subAmount) {
        callStake('stakeMain', [parseUnits(amount?.toString() || '0', 18)]);
      } else {
        approveSub();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedMain]);

  useEffect(() => {
    if (isConfirmedSub) {
      callStake('stakeMain', [parseUnits(amount?.toString() || '0', 18)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedSub]);

  return { call, isConfirmed, error, hash };
};

export default useStake;
