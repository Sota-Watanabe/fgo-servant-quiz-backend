import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoController } from './demo/demo.controller';
import { DemoService } from './demo/demo.service';
import { QuizController } from './quiz/quiz.controller';
import { QuizService } from './quiz/quiz.service';
import { ServantsController } from './servants/servants.controller';
import { ServantsService } from './servants/servants.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    DemoController,
    QuizController,
    ServantsController,
  ],
  providers: [AppService, DemoService, QuizService, ServantsService],
})
export class AppModule {}
