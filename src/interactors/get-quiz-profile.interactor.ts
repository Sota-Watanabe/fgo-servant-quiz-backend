import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ServantProfileGetResponseDto } from '@/dto/servant-profile-get-response.dto';
import { DumpService } from '@/services/dump.service';
import { FgoGameApiService } from '@/services/fgo-game-api.service';
import { VertexAiApiService } from '@/services/vertex-ai-api.service';
import { QuizResultRepository } from '@/repositories/profile-quiz.repository';

@Injectable()
export class GetQuizProfileInteractor {
  constructor(
    private readonly dumpService: DumpService,
    private readonly fgoGameApiService: FgoGameApiService,
    private readonly vertexAiApiService: VertexAiApiService,
    private readonly quizResultRepository: QuizResultRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute(servantId?: number): Promise<ServantProfileGetResponseDto> {
    return await this.dataSource.transaction(
      async (manager): Promise<ServantProfileGetResponseDto> => {
        const targetServant = servantId
          ? await this.dumpService.getServantById(servantId)
          : await this.dumpService.getRandomServant();

        if (!targetServant) {
          throw new NotFoundException(
            `Servant with id ${servantId as number} was not found in dump.`,
          );
        }

        // サーヴァントの詳細情報を取得
        const servantDetail = await this.fgoGameApiService.getServantDetail(
          targetServant.id,
        );

        const rawProfile = servantDetail.profile.comments[0]?.comment ?? '';

        const quizResult = await this.quizResultRepository.findByServantId(
          targetServant.id,
          manager,
        );

        if (quizResult?.maskedProfile) {
          console.log('---- Quiz Profile Cache Hit ----');
          console.log('servantId:', targetServant.id);
          console.log('maskedProfile:', quizResult.maskedProfile);
          console.log('--------------------\n');

          return new ServantProfileGetResponseDto(
            servantDetail,
            quizResult.maskedProfile,
          );
        }

        const maskedProfile = await this.vertexAiApiService.maskServantName(
          rawProfile,
          servantDetail.name,
        );

        await this.quizResultRepository.save(
          {
            id: quizResult?.id,
            servantId: targetServant.id,
            rawProfile,
            maskedProfile,
          },
          manager,
        );

        console.log('---- Quiz Profile Generation ----');
        console.log('servantDetail.name:', servantDetail.name);
        console.log('rawProfile:', rawProfile);
        console.log('--------------------\n');
        console.log('maskedProfile:', maskedProfile);

        return new ServantProfileGetResponseDto(servantDetail, maskedProfile);
      },
    );
  }
}
