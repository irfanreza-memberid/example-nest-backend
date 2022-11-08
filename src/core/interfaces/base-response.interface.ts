export interface BaseResponseSuccess<T> {
  message?: 'success';
  statusCode?: 200;
  data: T;
}
