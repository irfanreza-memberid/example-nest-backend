import { RequestContext } from '@medibloc/nestjs-request-context';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAuditLog } from '../interfaces/audit-log.interface';
import { AuthUser } from '../interfaces/auth.interface';
import { AuditLog, AuditLogDocument } from './audit-log.schema';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  @OnEvent('event.auditlog')
  private insert(data: IAuditLog): void {
    const serviceCtx: AuthUser = RequestContext.get();
    data.admin = serviceCtx.admin;
    data.ip = serviceCtx.ip;
    data.date = new Date();
    new this.auditLogModel(data).save();
  }
}
