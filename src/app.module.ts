import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizController } from './quiz/quiz.controller';
import { QuizService } from './quiz/quiz.service';
import { ServantsController } from './servants/servants.controller';
import { ServantsService } from './servants/servants.service';

// New architecture imports
import { ServantRepository } from '@/repositories/servant.repository';
import { ServantService } from '@/services/servant.service';
import { GetServantOptionsInteractor } from '@/interactors/get-servant-options.interactor';
import { GetSkillQuizInteractor } from '@/interactors/get-skill-quiz.interactor';

@Module({
  imports: [],
  controllers: [AppController, QuizController, ServantsController],
  providers: [
    AppService,
    QuizService,
    ServantsService,
    // Repository
    ServantRepository,
    // Services
    ServantService,
    // Interactors
    GetServantOptionsInteractor,
    GetSkillQuizInteractor,
  ],
})
export class AppModule {}
