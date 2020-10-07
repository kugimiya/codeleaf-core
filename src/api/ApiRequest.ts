import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiRequest {
  instance: AxiosInstance;

  constructor(API_BASE_URL: string) {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
    });
  }

  request<ResponseDto>(config: AxiosRequestConfig): Promise<AxiosResponse<ResponseDto>> {
    return this.instance.request<ResponseDto>(config);
  }
}

export default ApiRequest;
