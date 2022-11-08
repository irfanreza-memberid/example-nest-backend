import { RequestContext } from '@medibloc/nestjs-request-context';

export class AuthUser extends RequestContext {
  admin: string;
  ip: string;
}
