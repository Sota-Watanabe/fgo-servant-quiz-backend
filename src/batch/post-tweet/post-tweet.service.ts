import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';
import { QUIZ_CARD_TYPES, QuizCardType } from '@/quiz/quiz-card.constants';
import { QuizCardService } from '@/services/quiz-card.service';

@Injectable()
export class PostTweetService {
  private readonly logger = new Logger(PostTweetService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly quizCardService: QuizCardService,
  ) {}

  async postDailyTweet(type?: QuizCardType): Promise<{ status: 'ok' }> {
    try {
      const quizType = this.pickQuizType(type);
      const { endpoint, payload, image } =
        await this.quizCardService.generateQuizCard(quizType);
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

  private pickQuizType(type?: QuizCardType): QuizCardType {
    if (type) {
      return type;
    }

    const index = Math.floor(Math.random() * QUIZ_CARD_TYPES.length);
    return QUIZ_CARD_TYPES[index];
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
      '#FateGrandQuiz',
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
