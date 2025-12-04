import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CreateOgpController } from '@/batch/create-ogp/create-ogp.controller';
import { CreateOgpService } from '@/batch/create-ogp/create-ogp.service';
import { QuizCardService } from '@/services/quiz-card.service';
import { FgoGameApiService } from '@/services/fgo-game-api.service';
import { DumpService } from '@/services/dump.service';
import { AtlasAcademyGateway } from '@/gateways/atlasacademy.gateway';
import { CloudStorageGateway } from '@/gateways/cloud-storage.gateway';
import { DatabaseModule } from '@/database/database.module';
import { RepositoriesModule } from '@/repositories/repositories.module';

@Module({
  imports: [HttpModule, ConfigModule, DatabaseModule, RepositoriesModule],
  controllers: [CreateOgpController],
  providers: [
    CreateOgpService,
    QuizCardService,
    FgoGameApiService,
    DumpService,
    AtlasAcademyGateway,
    CloudStorageGateway,
  ],
})
export class CreateOgpModule {}
