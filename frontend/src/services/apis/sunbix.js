import { client } from './axios';

const fetchNonce = (params) => client.get(`/authentication/nonce`, { params });
const login = (body) => client.post(`/authentication/token`, body);
const fetchPool = () => client.get(`/pool`);
const fetchPrice = () => client.get(`/stake/price`);
const fetchStatistic = () => client.get(`/system-configs/info`);
const fetchMe = () => client.get(`/user/info`);
const fetchMyPoolsStaking = (poolId, userId) =>
  client.get(`/stake?desc=true&orderBy=createdAt&page=1&size=50&status=0&poolId=${poolId}&userId=${userId}`);
const fetchMyPoolsLending = () => client.get(`/stake?stakeTokenSymbol=RKA&desc=true&orderBy=createdAt&status=0`);
const staking = (body) => client.post(`/stake`, body);
const claimHarvest = (body) => client.post(`/stake/harvest`, body);
const unstake = (body) => client.post(`/stake/unstake`, body);
const fetchTransaction = (params) => client.get(`/transaction`, { params });
const fetchLastTransaction = (params) => client.get(`/transaction/last`, { params });
const fetchTransactionRef = (params) => client.get(`/transaction/ref`, { params });
const addRef = (body) => client.patch(`/user/add-ref`, body);
const fetchRef = (params) => client.get(`/user/ref`, { params });
const fetchSystemConfig = () => client.get(`/system-configs`);
const claimRef = (body) => client.post(`/transaction/claim-ref`, body);
const fetchUserHarvestTime = () => client.get(`/user/harvest`);
const claimAll = (body) => client.post(`/transaction/claim`, body);

const sunbixService = {
  claimAll,
  fetchLastTransaction,
  fetchUserHarvestTime,
  claimRef,
  login,
  fetchNonce,
  fetchPool,
  fetchPrice,
  fetchMyPoolsStaking,
  fetchMyPoolsLending,
  staking,
  claimHarvest,
  unstake,
  fetchTransaction,
  fetchMe,
  addRef,
  fetchRef,
  fetchTransactionRef,
  fetchSystemConfig,
  fetchStatistic
};

export default sunbixService;
