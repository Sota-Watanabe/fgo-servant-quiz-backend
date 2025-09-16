import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoController } from './demo/demo.controller';
import { DemoService } from './demo/demo.service';
import { QuizController } from './quiz/quiz.controller';
import { QuizService } from './quiz/quiz.service';

@Module({
  imports: [],
  controllers: [AppController, DemoController, QuizController],
  providers: [AppService, DemoService, QuizService],
})
export class AppModule {}
