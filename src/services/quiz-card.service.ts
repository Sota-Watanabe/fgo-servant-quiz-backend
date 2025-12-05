import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import puppeteer, { Browser } from 'puppeteer';
import sharp from 'sharp';
import { buildHtml } from '@/batch/post-tweet/post-tweet-html.builder';
import {
  QUIZ_CARD_ENDPOINT_MAP,
  QuizCardType,
} from '@/quiz/quiz-card.constants';

export type QuizCardResult = {
  endpoint: string;
  payload: unknown;
  html: string;
  image: Buffer;
};

export type QuizCardImageOptions = {
  width?: number;
  height?: number;
  isOgp?: boolean;
};

const DEFAULT_VIEWPORT_WIDTH = 1200;
const DEFAULT_VIEWPORT_HEIGHT = 630;
const RESIZE_BACKGROUND = { r: 15, g: 23, b: 42, alpha: 1 };

@Injectable()
export class QuizCardService implements OnModuleDestroy {
  private browser: Browser | null = null;
  private browserPromise: Promise<Browser> | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.browserPromise = null;
    }
  }

  private async getBrowser(): Promise<Browser> {
    if (this.browser && this.browser.connected) {
      return this.browser;
    }

    // 複数の同時リクエストで重複起動を防ぐ
    if (!this.browserPromise) {
      this.browserPromise = puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-zygote',
          '--disable-accelerated-2d-canvas',
          '--disable-background-networking',
          '--disable-background-timer-throttling',
          '--disable-breakpad',
          '--disable-client-side-phishing-detection',
          '--disable-default-apps',
          '--disable-extensions',
          '--disable-features=site-per-process',
          '--disable-hang-monitor',
          '--disable-popup-blocking',
          '--disable-prompt-on-repost',
          '--disable-sync',
          '--metrics-recording-only',
          '--mute-audio',
          '--no-first-run',
          '--safebrowsing-disable-auto-update',
          '--enable-automation',
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      });

      this.browser = await this.browserPromise;
      this.browserPromise = null;
    } else {
      await this.browserPromise;
      if (this.browser) {
        return this.browser;
      }
    }

    return this.browser!;
  }

  async generateQuizCard(
    type: QuizCardType,
    servantId?: number,
    imageOptions?: QuizCardImageOptions,
  ): Promise<QuizCardResult> {
    const endpoint = QUIZ_CARD_ENDPOINT_MAP[type];
    const payload = await this.fetchQuizPayload(endpoint, servantId);
    const html = buildHtml(endpoint, payload, {
      isOgp: imageOptions?.isOgp,
    });
    const image = await this.renderHtmlToImage(html, imageOptions);

    return {
      endpoint,
      payload,
      html,
      image,
    };
  }

  private async fetchQuizPayload(
    endpoint: string,
    servantId?: number,
  ): Promise<unknown> {
    const baseUrl = this.resolveQuizApiBaseUrl();
    const url = `${baseUrl.replace(/\/$/, '')}${endpoint}`;
    const config =
      servantId !== undefined ? { params: { servantId } } : undefined;
    const response = await lastValueFrom(this.httpService.get(url, config));
    return response.data;
  }

  private async renderHtmlToImage(
    html: string,
    imageOptions?: QuizCardImageOptions,
  ): Promise<Buffer> {
    const targetWidth = imageOptions?.width;
    const targetHeight = imageOptions?.height;
    const viewportWidth = targetWidth ?? DEFAULT_VIEWPORT_WIDTH;
    const viewportHeight = targetHeight ?? DEFAULT_VIEWPORT_HEIGHT;
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      await page.setViewport({
        width: viewportWidth,
        height: viewportHeight,
        deviceScaleFactor: 2,
      });
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const screenshot = (await page.screenshot({
        type: 'png',
        fullPage: true,
      })) as Buffer;

      const resizedImage = await this.resizeImageIfNeeded(
        screenshot,
        targetWidth,
        targetHeight,
      );

      return resizedImage;
    } finally {
      await page.close(); // ページを必ずクローズしてメモリを解放
    }
  }

  private async resizeImageIfNeeded(
    image: Buffer,
    width?: number,
    height?: number,
  ): Promise<Buffer> {
    // return image;
    if (!width && !height) {
      return image;
    }

    if (width && height) {
      return sharp(image)
        .resize(width, height, {
          fit: 'contain',
          background: RESIZE_BACKGROUND,
        })
        .png()
        .toBuffer();
    }

    return sharp(image)
      .resize(width ?? null, height ?? null)
      .png()
      .toBuffer();
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
}
