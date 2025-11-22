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
    // OGPエンドポイントは Cloud CDN でのキャッシュを安定させるため、
    // CORS ヘッダーを一切付与しない（credentials=true があるとキャッシュされない）
    if (req.url.startsWith('/ogp')) {
      // setHeaderをオーバーライドしてCORS関連ヘッダーの設定を防ぐ
      const originalSetHeader = res.setHeader.bind(res) as typeof res.setHeader;
      res.setHeader = function (
        this: Response,
        name: string,
        value: string | number | readonly string[],
      ): Response {
        const lowerName = name.toLowerCase();
        if (
          lowerName === 'access-control-allow-origin' ||
          lowerName === 'access-control-allow-credentials' ||
          lowerName === 'access-control-allow-methods' ||
          lowerName === 'access-control-allow-headers' ||
          lowerName === 'vary'
        ) {
          // CORSヘッダーは設定しない
          return this;
        }
        return originalSetHeader.call(this, name, value) as Response;
      };

      next();
      return;
    }

    // それ以外のエンドポイントはスキップ（main.ts の enableCors で処理）
    next();
  }
}
