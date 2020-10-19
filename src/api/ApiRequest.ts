import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Interceptor, { InjectorOptions } from './Interceptor';

class ApiRequest<AuthTokenType> {
  instance: AxiosInstance;

  tokenInjector: (req: AxiosRequestConfig) => AxiosRequestConfig;

  constructor(
      baseUrl: string,
      interceptorInjectOptions: InjectorOptions<AuthTokenType>,
      tokenInjector: (req: AxiosRequestConfig) => AxiosRequestConfig,
  ) {
    this.instance = axios.create({
      baseURL: baseUrl,
    });

    Interceptor<AuthTokenType>(this.instance, interceptorInjectOptions);
    this.tokenInjector = tokenInjector;
  }

  request<ResponseDto>(config: AxiosRequestConfig & { skipAuthInject?: boolean }): Promise<AxiosResponse<ResponseDto>> {
    return this.instance.request<ResponseDto>(config.skipAuthInject ? config : this.tokenInjector(config));
  }
}

export default ApiRequest;
