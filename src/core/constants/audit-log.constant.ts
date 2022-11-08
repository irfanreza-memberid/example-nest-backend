import { RequestContext } from '@medibloc/nestjs-request-context';

export const METADATA_AUDITLOG = 'ACTION_AUDIT_LOG';
export const METADATA_AUDITLOG_SERVICE = 'METADATA_AUDITLOG_SERVICE';

export interface IAuditServiceLog {
  name: string;
  data: any;
}
export class AuditServiceLogCtx extends RequestContext {
  ctx: IAuditServiceLog[];
  useCase?: any;
}

export const AuditLogEvent = 'AUDIT_LOG_EVENT';
