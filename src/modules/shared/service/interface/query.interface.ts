import * as https from 'https';

export interface QueryInfo {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any | string;
  params?: any;
  headers?: any;
  httpsAgent?: https.Agent;
  responseType?: string;
}
