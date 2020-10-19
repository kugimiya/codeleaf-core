/* eslint-disable */
// @ts-nocheck

// I disable file checking, cause its third-party solution written in JS (some mind-blow)
// Btw, i remove some unnecessary code
// thanks to: https://gist.github.com/Godofbrowser/bf118322301af3fc334437c683887c5f

import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export interface InjectorOptions<T> {
  shouldIntercept?: (error: AxiosError) => boolean;
  setTokenData?: (authData: T) => void;
  handleTokenRefresh?: (axiosClient: AxiosInstance) => Promise<T>;
  attachTokenToRequest?: (request: AxiosRequestConfig) => void;
}

const Interceptor = <T>(axiosClient: AxiosInstance, customOptions: InjectorOptions<T>): void => {
  let isRefreshing = false;
  let failedQueue = [];

  const options = customOptions;

  const processQueue = (error: AxiosError, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  const interceptor = (error: AxiosError) => {
    if (!options.shouldIntercept(error)) {
      return Promise.reject(error);
    }

    if (error.config._retry || error.config._queued) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest._queued = true;
          options.attachTokenToRequest(originalRequest, token);
          return axiosClient.request(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(error); // Ignore refresh token request's "err" and return actual "error" for the original request
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise((resolve, reject) => {
      options.handleTokenRefresh
        .call(options.handleTokenRefresh)
        .then((tokenData) => {
          options.setTokenData(tokenData, axiosClient);
          options.attachTokenToRequest(originalRequest, tokenData.idToken);
          processQueue(null, tokenData.idToken);
          resolve(axiosClient.request(originalRequest));
        })
        .catch((err) => {
          processQueue(err, null);
          reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  };

  axiosClient.interceptors.response.use(undefined, interceptor);
};

export default Interceptor;
