import { IS_PUBLIC_KEY, RESPONSE_MESSAGE } from '@/constant/constant';
import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);
