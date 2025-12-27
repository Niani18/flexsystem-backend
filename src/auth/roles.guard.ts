import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../shared/decorators.js';
import { Role } from './role.enum.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lee los roles requeridos del decorador @Roles(...)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no exige roles, se permite (deja que el AuthGuard decida)
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user; // viene del AuthGuard

    if (!user) throw new ForbiddenException('User not found in request');

    // Soporta uno o varios roles en el usuario
    const userRoles: Role[] = Array.isArray(user.role) ? user.role : [user.role];

    const authorized = requiredRoles.some((r) => userRoles.includes(r));
    if (!authorized) throw new ForbiddenException('Insufficient role');

    return true;
  }
}