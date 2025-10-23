import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizController } from './quiz/quiz.controller';
import { QuizService } from './quiz/quiz.service';
import { ServantsController } from './servants/servants.controller';
import { ServantsService } from './servants/servants.service';

// New architecture imports
import { FgoGameApiService } from '@/services/fgo-game-api.service';
import { DumpService } from '@/services/dump.service';
import { AtlasAcademyGateway } from '@/gateways/atlasacademy.gateway';
import { GetServantOptionsInteractor } from '@/interactors/get-servant-options.interactor';
import { GetQuizSkillInteractor } from '@/interactors/get-quiz-skill.interactor';
import { GetQuizProfileInteractor } from '@/interactors/get-quiz-profile.interactor';
import { GetQuizNpInteractor } from '@/interactors/get-quiz-np.interactor';

@Module({
  imports: [],
  controllers: [AppController, QuizController, ServantsController],
  providers: [
    AppService,
    QuizService,
    ServantsService,
    // Services
    FgoGameApiService,
    DumpService,
    AtlasAcademyGateway,
    // Interactors
    GetServantOptionsInteractor,
    GetQuizSkillInteractor,
    GetQuizProfileInteractor,
    GetQuizNpInteractor,
  ],
})
export class AppModule {}
