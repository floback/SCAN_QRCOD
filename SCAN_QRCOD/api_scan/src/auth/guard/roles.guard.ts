import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from '../decoraters/ roles.decorator';
  import { UserType } from 'src/user/entities/user.entity';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
  
      if (!requiredRoles) {
        return true; // nenhuma role necessária
      }
  
      const { user } = context.switchToHttp().getRequest();
  
      if (!requiredRoles.includes(user.type_user)) {
        throw new ForbiddenException('Você não tem permissão para acessar essa rota.');
      }
  
      return true;
    }
  }
  