export interface IAuditLog {
  admin?: string;
  action?: string;
  ip?: string;
  date?: Date;
  requestBody?: string;
}
