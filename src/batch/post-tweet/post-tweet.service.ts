import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';
import { lastValueFrom } from 'rxjs';
import puppeteer from 'puppeteer';

@Injectable()
export class PostTweetService {
  private readonly logger = new Logger(PostTweetService.name);
  private readonly quizEndpoints = ['/quiz/skill', '/quiz/profile', '/quiz/np'];

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async postDailyTweet(): Promise<{ status: 'ok' }> {
    try {
      const endpoint = this.pickEndpoint();
      const payload = await this.fetchQuizPayload(endpoint);
      const html = this.buildHtml(endpoint, payload);
      const image = await this.renderHtmlToImage(html);
      await this.tweetImage(image);

      this.logger.log(
        `Tweet sent successfully from endpoint ${endpoint}`,
        PostTweetService.name,
      );

      return { status: 'ok' };
    } catch (error) {
      this.logger.error(
        'Failed to execute postDailyTweet',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  private pickEndpoint(): string {
    const index = Math.floor(Math.random() * this.quizEndpoints.length);
    return this.quizEndpoints[index];
  }

  private async fetchQuizPayload(endpoint: string): Promise<unknown> {
    const parsedPort = parseInt(
      this.configService.get<string>('PORT') ?? '',
      10,
    );
    const port = Number.isNaN(parsedPort) ? 8888 : parsedPort;
    const baseUrl = `http://localhost:${port}`;
    const url = `${baseUrl.replace(/\/$/, '')}${endpoint}`;
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data;
  }

  private buildHtml(endpoint: string, payload: unknown): string {
    const title = this.makeTitle(endpoint);
    const payloadString = this.escapeHtml(JSON.stringify(payload, null, 2));

    return `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: 'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif;
        background: #0f172a;
        color: #f8fafc;
        margin: 0;
        padding: 32px;
        width: 800px;
        box-sizing: border-box;
      }
      .card {
        background: rgba(15, 23, 42, 0.8);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 20px 25px rgba(15, 23, 42, 0.45);
      }
      h1 {
        font-size: 32px;
        margin-top: 0;
        margin-bottom: 16px;
      }
      pre {
        background: rgba(15, 23, 42, 0.6);
        padding: 16px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.6;
        overflow: hidden;
        white-space: pre-wrap;
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${title}</h1>
      <p>今日のクイズ結果をお届け！</p>
      <pre>${payloadString}</pre>
    </div>
  </body>
</html>`;
  }

  private makeTitle(endpoint: string): string {
    if (endpoint.includes('skill')) {
      return 'スキル クイズ結果';
    }
    if (endpoint.includes('profile')) {
      return 'プロフィール クイズ結果';
    }
    if (endpoint.includes('np')) {
      return '宝具 クイズ結果';
    }
    return 'FGO クイズ結果';
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private async renderHtmlToImage(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 900, height: 900, deviceScaleFactor: 2 });
      await page.setContent(html, { waitUntil: 'networkidle0' });
      return (await page.screenshot({ type: 'png', fullPage: true })) as Buffer;
    } finally {
      await browser.close();
    }
  }

  private async tweetImage(image: Buffer): Promise<void> {
    const credentials = this.readTwitterCredentials();
    const twitterClient = new TwitterApi(credentials);

    const mediaId = await twitterClient.v1.uploadMedia(image, {
      type: 'png',
    });

    await twitterClient.v2.tweet('今日の結果はこちら！', {
      media: { media_ids: [mediaId] },
    });
  }

  private readTwitterCredentials() {
    const appKey = this.configService.get<string>('TWITTER_API_KEY');
    const appSecret = this.configService.get<string>('TWITTER_API_SECRET');
    const accessToken = this.configService.get<string>('TWITTER_ACCESS_TOKEN');
    const accessSecret = this.configService.get<string>(
      'TWITTER_ACCESS_SECRET',
    );

    if (!appKey || !appSecret || !accessToken || !accessSecret) {
      throw new Error('Twitter API credentials are not configured.');
    }

    return {
      appKey,
      appSecret,
      accessToken,
      accessSecret,
    };
  }
}
