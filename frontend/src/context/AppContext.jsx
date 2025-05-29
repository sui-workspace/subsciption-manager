import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { createContext, useMemo } from "react";
import { useResolveSuiNSName } from "@mysten/dapp-kit";

export const AppContext = createContext({
    walletAddress: undefined,
    suiName: undefined,
});

export const AppContextProvider = (props) => {
    const client = useSuiClient();
    const account = useCurrentAccount();

    const walletAddress = useMemo(() => {
        return account?.address;
    }, [account]);

    const { data: suiName } = useResolveSuiNSName(walletAddress);

    return (
        <>
            <AppContext.Provider
                value={{
                    walletAddress,
                    suiName,
                }}
            >
                {props.children}
            </AppContext.Provider>
        </>
    );
};
