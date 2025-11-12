import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';
import { lastValueFrom } from 'rxjs';
import puppeteer from 'puppeteer';
import { buildHtml } from '@/batch/post-tweet/post-tweet-html.builder';

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
      const html = buildHtml(endpoint, payload);
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
