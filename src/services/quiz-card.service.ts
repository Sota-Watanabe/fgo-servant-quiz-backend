import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import puppeteer from 'puppeteer';
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

@Injectable()
export class QuizCardService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async generateQuizCard(
    type: QuizCardType,
    servantId?: number,
  ): Promise<QuizCardResult> {
    const endpoint = QUIZ_CARD_ENDPOINT_MAP[type];
    const payload = await this.fetchQuizPayload(endpoint, servantId);
    const html = buildHtml(endpoint, payload);
    const image = await this.renderHtmlToImage(html);

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
}
