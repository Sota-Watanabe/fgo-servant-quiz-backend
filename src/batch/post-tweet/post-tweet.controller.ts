import { BadRequestException, Controller, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  PostTweetService,
  PostTweetType,
  POST_TWEET_TYPES,
} from './post-tweet.service';

@ApiTags('batch')
@Controller('batch/post-tweet')
export class PostTweetController {
  constructor(private readonly postTweetService: PostTweetService) {}

  @Post('daily')
  @ApiQuery({
    name: 'type',
    required: false,
    enum: POST_TWEET_TYPES,
    description: 'np | skill | profile を指定するとそのタイプのツイートを投稿',
  })
  async postDailyTweet(@Query('type') type?: string) {
    const quizType = this.parseQuizType(type);
    return this.postTweetService.postDailyTweet(quizType);
  }

  private parseQuizType(type?: string): PostTweetType | undefined {
    if (!type) {
      return undefined;
    }

    const normalized = type.trim().toLowerCase();
    if ((POST_TWEET_TYPES as readonly string[]).includes(normalized)) {
      return normalized as PostTweetType;
    }

    throw new BadRequestException(
      `Query parameter "type" must be one of: ${POST_TWEET_TYPES.join(', ')}`,
    );
  }
}
