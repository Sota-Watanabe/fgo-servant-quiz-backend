import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizController } from './quiz/quiz.controller';
import { ServantsController } from './servants/servants.controller';
import { ServantsService } from './servants/servants.service';
// New architecture imports
import { FgoGameApiService } from '@/services/fgo-game-api.service';
import { DumpService } from '@/services/dump.service';
import { AtlasAcademyGateway } from '@/gateways/atlasacademy.gateway';
import { VertexAiGateway } from '@/gateways/vertex-ai.gateway';
import { GetServantOptionsInteractor } from '@/interactors/get-servant-options.interactor';
import { GetQuizSkillInteractor } from '@/interactors/get-quiz-skill.interactor';
import { GetQuizProfileInteractor } from '@/interactors/get-quiz-profile.interactor';
import { GetQuizNpInteractor } from '@/interactors/get-quiz-np.interactor';
import { DatabaseModule } from '@/database/database.module';
import { RepositoriesModule } from '@/repositories/repositories.module';
import { VertexAiApiService } from '@/services/vertex-ai-api.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    RepositoriesModule,
  ],
  controllers: [AppController, QuizController, ServantsController],
  providers: [
    AppService,
    ServantsService,
    // Services / Gateways
    FgoGameApiService,
    DumpService,
    AtlasAcademyGateway,
    VertexAiGateway,
    VertexAiApiService,
    // Interactors
    GetServantOptionsInteractor,
    GetQuizSkillInteractor,
    GetQuizProfileInteractor,
    GetQuizNpInteractor,
  ],
})
export class AppModule {}
