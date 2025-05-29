import useUser from '@/reducers/user';
import { notification } from 'antd';
import axios from 'axios';
import { stringify } from 'query-string';

import { API_URL } from '../../utils/constants';

const DEFAULT_ERROR = 'Something went wrong. Please try again!';

const onError = ({ response }) => {
  if (response) {
    const { code, data, errorCodeText, status } = response;
    const errorCode = status || code;
    if (errorCode === 401) {
      notification.error({
        key: 'axios',
        message: `${errorCode} - ${errorCodeText || data?.message || data?.errors?.[0]?.message || DEFAULT_ERROR}`
      });
      useUser.getState().logout();
    } else if (errorCode < 500) {
      notification.error({
        key: 'axios',
        message: data?.message || data?.errors?.[0]?.message || DEFAULT_ERROR
      });
    } else {
      notification.error({
        key: 'axios',
        message: `${errorCode} - ${errorCodeText || data?.message || data?.errors?.message || DEFAULT_ERROR}`
      });
    }
  } else {
    notification.error({
      key: 'axios',
      message: 'Cannot connect to Server'
    });
  }
  return Promise.reject(response);
};

const beforeRequest = (config) => {
  const { accessToken } = useUser.getState().user;
  if (accessToken) {
    Object.assign(config.headers, { Authorization: `Bearer ${accessToken}` });
  }
  if (config.data instanceof FormData) {
    Object.assign(config.headers, { 'Content-Type': 'multipart/form-data' });
  }
  return config;
};

const client = axios.create({
  baseURL: API_URL,
  paramsSerializer: (params) => stringify(params, { arrayFormat: '' })
});
client.interceptors.request.use(beforeRequest);

[client].forEach((client) => {
  client.interceptors.response.use(({ data: response, config }) => {
    const { success } = response;
    if (success || config.isIgnoreError) return response?.data;
    notification.error({
      key: 'axios',
      message: response?.errors?.message || DEFAULT_ERROR
    });

    return Promise.reject({});
  }, onError);
});

export { client };
