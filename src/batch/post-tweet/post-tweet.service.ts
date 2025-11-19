import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';
import { lastValueFrom } from 'rxjs';
import puppeteer from 'puppeteer';
import { buildHtml } from '@/batch/post-tweet/post-tweet-html.builder';

export const POST_TWEET_TYPES = ['skill', 'profile', 'np'] as const;
export type PostTweetType = (typeof POST_TWEET_TYPES)[number];

@Injectable()
export class PostTweetService {
  private readonly logger = new Logger(PostTweetService.name);
  private readonly quizEndpointMap: Record<PostTweetType, string> = {
    skill: '/quiz/skill',
    profile: '/quiz/profile',
    np: '/quiz/np',
  };
  private readonly quizEndpoints = Object.values(this.quizEndpointMap);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async postDailyTweet(type?: PostTweetType): Promise<{ status: 'ok' }> {
    try {
      const endpoint = this.pickEndpoint(type);
      const payload = await this.fetchQuizPayload(endpoint);
      const html = buildHtml(endpoint, payload);
      const image = await this.renderHtmlToImage(html);
      const answerUrl = this.buildAnswerUrl(endpoint, payload);
      await this.tweetImage(endpoint, image, answerUrl);

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

  private pickEndpoint(type?: PostTweetType): string {
    if (type) {
      return this.quizEndpointMap[type];
    }

    const index = Math.floor(Math.random() * this.quizEndpoints.length);
    return this.quizEndpoints[index];
  }

  private async fetchQuizPayload(endpoint: string): Promise<unknown> {
    const baseUrl = this.resolveQuizApiBaseUrl();
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

  private resolveQuizApiBaseUrl(): string {
    const configured = this.configService.get<string>('QUIZ_API_BASE_URL');
    if (configured && configured.trim().length > 0) {
      return configured.trim();
    }

    const parsedPort = parseInt(
      this.configService.get<string>('PORT') ?? '',
      10,
    );
    const port = Number.isNaN(parsedPort) ? 8888 : parsedPort;
    return `http://localhost:${port}`;
  }

  private async tweetImage(
    endpoint: string,
    image: Buffer,
    answerUrl: string,
  ): Promise<void> {
    const credentials = this.readTwitterCredentials();
    const twitterClient = new TwitterApi(credentials);
    const tweetText = this.buildTweetText(endpoint, answerUrl);

    const mediaId = await twitterClient.v1.uploadMedia(image, {
      type: 'png',
    });

    await twitterClient.v2.tweet(tweetText, {
      media: { media_ids: [mediaId] },
    });
  }

  private buildTweetText(endpoint: string, answerUrl: string): string {
    const lines = [
      '🧩 FGO サーヴァント当てクイズ',
      `答えはこちら → ${answerUrl}`,
      '#FGO',
    ];

    return lines.join('\n');
  }

  private buildAnswerUrl(endpoint: string, payload: unknown): string {
    const servantId = this.extractServantId(payload);

    if (!servantId) {
      throw new Error('Servant ID is missing in quiz payload.');
    }

    const baseUrl = 'https://fate-grand-quiz.com';
    const path = this.getAnswerPath(endpoint);
    const url = new URL(path, baseUrl);
    url.searchParams.set('servantId', servantId);
    return url.toString();
  }

  private extractServantId(payload: unknown): string | null {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const record = payload as Record<string, unknown>;
    const rawId = record.id;

    if (typeof rawId === 'number') {
      return String(rawId);
    }

    if (typeof rawId === 'string' && rawId.trim().length > 0) {
      return rawId.trim();
    }

    return null;
  }

  private getAnswerPath(endpoint: string): string {
    if (endpoint.includes('skill')) {
      return '/quiz/skill';
    }

    if (endpoint.includes('profile')) {
      return '/quiz/profile';
    }

    if (endpoint.includes('np')) {
      return '/quiz/np';
    }

    return '/quiz';
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
