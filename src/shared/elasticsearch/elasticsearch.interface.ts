export interface DataLoggerRestAPI {
  createdAt: string;
  headers: string;
  url: string;
  method: string;
  params: string;
  query: string;
  request: string;
  response: string;
  status: string;
}

export interface TransformLogger {
  body: DataLoggerRestAPI;
  index: string;
  type: string;
}
