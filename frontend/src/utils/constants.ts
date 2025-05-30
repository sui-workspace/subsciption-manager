/// <reference types="vite/client" />

export const COOKIE_NAME: string = 'sunbix';

export const IS_MAINNET: boolean = import.meta.env.VITE_ENV !== 'testnet';
export const SOL_TOKEN: string = import.meta.env.VITE_TOKEN_SOL;
export const SUNBIX_TOKEN: string = import.meta.env.VITE_TOKEN_SUNBIX;
export const SWAP_CONTRACT: string = import.meta.env.VITE_SWAP_CONTRACT;
export const API_URL: string = import.meta.env.VITE_API_URL;
export const BSC_SCAN: string = import.meta.env.VITE_BSC_SCAN;
