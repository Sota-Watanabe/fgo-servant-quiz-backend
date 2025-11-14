import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostTweetModule } from './post-tweet/post-tweet.module';
import { BatchHealthController } from './batch-health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostTweetModule,
  ],
  controllers: [BatchHealthController],
})
export class BatchAppModule {}
