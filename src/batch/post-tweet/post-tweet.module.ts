import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PostTweetController } from './post-tweet.controller';
import { PostTweetService } from './post-tweet.service';
import { QuizCardService } from '@/services/quiz-card.service';

@Module({
  imports: [HttpModule],
  controllers: [PostTweetController],
  providers: [PostTweetService, QuizCardService],
})
export class PostTweetModule {}
