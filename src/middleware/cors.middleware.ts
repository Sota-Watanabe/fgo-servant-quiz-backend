import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  private readonly allowedOrigins: string[];

  constructor() {
    this.allowedOrigins =
      process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || 'https://your-frontend-domain.com']
        : ['http://localhost:3000', 'http://192.168.10.112'];
  }

  use(req: Request, res: Response, next: NextFunction): void {
    // OGPエンドポイントの場合はCORSヘッダーを送信しない（画像を返すだけなので不要）
    if (req.url.startsWith('/ogp')) {
      next();
      return;
    }

    // それ以外のエンドポイントはCORS処理を実行
    const origin = req.headers.origin;
    if (
      !origin ||
      (typeof origin === 'string' && this.allowedOrigins.includes(origin))
    ) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE',
      );
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      // プリフライトリクエストの場合
      if (req.method === 'OPTIONS') {
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Content-Type, Authorization',
        );
        res.sendStatus(204);
        return;
      }
    }

    next();
  }
}
