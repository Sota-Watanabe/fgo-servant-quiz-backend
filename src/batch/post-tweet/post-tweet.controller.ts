import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostTweetService } from './post-tweet.service';

@ApiTags('batch')
@Controller('batch/post-tweet')
export class PostTweetController {
  constructor(private readonly postTweetService: PostTweetService) {}

  @Post('daily')
  async postDailyTweet() {
    return this.postTweetService.postDailyTweet();
  }
}
