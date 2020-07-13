import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly config: ConfigService) {}

  use(req: Request, _res: Response, next: () => void): void {
    const token = req.headers['x-token']
    if (!token || token !== this.config.get<string>('AUTH_TOKEN')) {
      throw new UnauthorizedException()
    }
    next()
  }
}
