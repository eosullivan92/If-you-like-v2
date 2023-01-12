import axios from 'axios';

type RequestOptions = {
  method?: string;
  data?: RequestData;
};

type RequestData = {
  title?: string;
  message?: string;
  body?: string;
  parentId?: string;
};

const api = axios.create({
  // baseURL: import.meta.env.VITE_SERVER_URL,
  baseURL: process.env.SERVER_URL,
  withCredentials: true,
});

export function makeRequest(url: string, options?: RequestOptions) {
  return api(`/api/${url}`, options)
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.message);
      Promise.reject(error?.response?.data?.message ?? 'error');
    });
}
