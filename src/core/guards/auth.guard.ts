import { RequestContext } from '@medibloc/nestjs-request-context';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthUser } from '../interfaces/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const ctx: AuthUser = RequestContext.get();
    ctx.admin = 'super.admin@member.id'; // disini masih hardcode untuk admin nya
    ctx.ip = request.ip;
    return true;
  }
}
