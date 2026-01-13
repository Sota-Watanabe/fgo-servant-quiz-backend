import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostTweetModule } from './post-tweet/post-tweet.module';
import { CreateOgpModule } from './create-ogp/create-ogp.module';
import { UpdateBasicServantModule } from './update-basic-servant/update-basic-servant.module';
import { BatchHealthController } from './batch-health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostTweetModule,
    CreateOgpModule,
    UpdateBasicServantModule,
  ],
  controllers: [BatchHealthController],
})
export class BatchAppModule {}
