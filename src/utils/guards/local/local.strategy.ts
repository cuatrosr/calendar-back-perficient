import { HttpUnauthorized } from '../../../utils/exceptions/http.exception';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { AuthService } from '../../../auth/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(request: Request, username: string, password: string) {
    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    const user = await authService.validateUser(username, password);
    if (!user) {
      throw HttpUnauthorized('User');
    }
    return user;
  }
}
