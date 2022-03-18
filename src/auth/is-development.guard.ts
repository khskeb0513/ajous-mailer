import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class IsDevelopmentGuard implements CanActivate {
  canActivate(): boolean {
    return process.env['NODE_ENV'] === 'development';
  }
}
