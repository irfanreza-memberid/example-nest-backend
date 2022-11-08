import { Client as ElasticsearchClient } from '@elastic/elasticsearch';
import { Injectable, Logger } from '@nestjs/common';

import { ELASTICSEARCH } from './elasticsearch.constant';
import { DataLoggerRestAPI, TransformLogger } from './elasticsearch.interface';

@Injectable()
export class ElasticsearchService {
  private readonly elasticsearchClient: ElasticsearchClient;
  private readonly logger = new Logger(ElasticsearchService.name);
  constructor() {
    this.elasticsearchClient = new ElasticsearchClient({
      node: ELASTICSEARCH.URL,
      auth: {
        username: ELASTICSEARCH.USERNAME,
        password: ELASTICSEARCH.PASSWORD,
      },
    });
    this.elasticsearchClient.ping().catch(() => {
      this.logger.error('Unable to reach Elasticsearch cluster');
    });
  }

  public async insertIndex(dataLogger: DataLoggerRestAPI): Promise<void> {
    const transformLogger = this.loggerDocument(dataLogger);
    this.elasticsearchClient.index(transformLogger);
  }

  private loggerDocument(dataLogger: DataLoggerRestAPI): TransformLogger {
    return {
      body: dataLogger,
      index: ELASTICSEARCH.INDEX,
      type: ELASTICSEARCH.TYPE,
    };
  }
}
