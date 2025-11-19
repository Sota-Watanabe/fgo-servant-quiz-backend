import { BadRequestException, Controller, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostTweetService } from './post-tweet.service';
import {
  QUIZ_CARD_TYPES,
  QuizCardType,
  normalizeQuizCardType,
} from '@/quiz/quiz-card.constants';

@ApiTags('batch')
@Controller('batch/post-tweet')
export class PostTweetController {
  constructor(private readonly postTweetService: PostTweetService) {}

  @Post('daily')
  @ApiQuery({
    name: 'type',
    required: false,
    enum: QUIZ_CARD_TYPES,
    description: 'np | skill | profile を指定するとそのタイプのツイートを投稿',
  })
  async postDailyTweet(@Query('type') type?: string) {
    const quizType = this.parseQuizType(type);
    return this.postTweetService.postDailyTweet(quizType);
  }

  private parseQuizType(type?: string): QuizCardType | undefined {
    if (!type) {
      return undefined;
    }

    const normalized = normalizeQuizCardType(type);
    if (normalized) {
      return normalized;
    }

    throw new BadRequestException(
      `Query parameter "type" must be one of: ${QUIZ_CARD_TYPES.join(', ')}`,
    );
  }
}
