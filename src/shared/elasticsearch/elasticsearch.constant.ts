import * as moment from 'moment';

export const ELASTICSEARCH = {
  URL: `http://127.0.0.1:9200/`,
  INDEX: `example-nest-pattern.${moment().format('YYYY-MM-DD')}`,
  TYPE: 'logs',
  USERNAME: '',
  PASSWORD: '',
};
