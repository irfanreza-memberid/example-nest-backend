import { RequestContext } from '@medibloc/nestjs-request-context';
import {
  AuditServiceLogCtx,
  IAuditServiceLog,
} from '../constants/audit-log.constant';

export function InsertAuditServiceResponseCtx(data: IAuditServiceLog[]): void {
  const ctx: AuditServiceLogCtx = RequestContext.get();
  ctx.ctx = data;
}

export function InsertAuditUseCaseCtx(useCase: any): void {
  const ctx: AuditServiceLogCtx = RequestContext.get();
  ctx.useCase = useCase;
}
