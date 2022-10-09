import { Injectable } from '@nestjs/common';
import Axios from 'axios';
// import { AppLogger } from './applogger.service';
import { QueryInfo } from './interface/query.interface';

@Injectable()
export class QueryService {
  // private logger: AppLogger;

  constructor() {
    // this.logger = new AppLogger('', 'sent', 'api');
  }

  public get(url: string, params: any): Promise<any> | undefined {
    delete params.url;
    // this.logger.log(
    //   `Sending Request | GET: ${url} | METHOD: ${
    //     params.method
    //   } | PARAMS: ${JSON.stringify(params)}`,
    // );
    try {
      return Axios.get(url, { params });
    } catch (e) {
      // this.logger.error(
      //   `An error happened whilst send query | Details ${JSON.stringify(e)}`,
      // );
    }
  }

  public async request(
    conf: QueryInfo,
    isNeedHeader = false,
  ): Promise<any | undefined | null> {
    // this.logger.log(`Sending Request | ${conf.method} ${conf.url}`);
    const config = {
      url: conf.url,
      params: conf.params,
      method: conf.method || 'GET',
      headers: conf.headers || {},
    };

    if (conf.data) {
      Object.assign(config, {
        data: conf.data,
      });
    }
    if (conf.responseType) {
      Object.assign(config, { responseType: conf.responseType });
    }
    if (conf.httpsAgent) {
      Object.assign(config, { httpsAgent: conf.httpsAgent });
    }
    try {
      const res = await Axios.request(config);

      if (isNeedHeader) {
        return res ? res : null;
      }
      return res ? res.data : null;
    } catch (e) {
      // this.logger.error(
      //   `An error happened | Query ${JSON.stringify(config)} | Detail ${e}`,
      // );
    }
  }
}
