import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { AuditLog, AuditLogDocument } from '../audit-log/audit-log.schema';
import { Model } from 'mongoose';
import { Reflector } from '@nestjs/core';
import {
  AuditServiceLogCtx,
  METADATA_AUDITLOG,
} from '../constants/audit-log.constant';
import * as Sentry from '@sentry/node';
import { RequestContext } from '@medibloc/nestjs-request-context';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const actionName = this.reflector.get(
      METADATA_AUDITLOG,
      context.getHandler(),
    );
    const audit: AuditLog = {
      action: actionName,
      ip: req.ip,
      admin: 'super admin',
      date: new Date(),
    };
    return next.handle().pipe(
      tap(
        null,
        (exception) => {
          // error handle
          if (actionName) {
            const createdErrorAudit = new this.auditLogModel(audit);
            createdErrorAudit.save();
          }
          Sentry.captureException(exception);
        },
        () => {
          // success handle
          if (actionName) {
            const createdSuccessAudit = new this.auditLogModel(audit);
            createdSuccessAudit.save();
          }
        },
      ),
    );
  }
}
