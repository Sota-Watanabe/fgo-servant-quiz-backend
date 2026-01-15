import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ServantNpVoiceGetResponseDto } from '@/dto/servant-np-voice-get-response.dto';
import { DumpService } from '@/services/dump.service';
import { FgoGameApiService } from '@/services/fgo-game-api.service';

@Injectable()
export class GetQuizNpVoiceInteractor {
  constructor(
    private readonly dumpService: DumpService,
    private readonly fgoGameApiService: FgoGameApiService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute(servantId?: number): Promise<ServantNpVoiceGetResponseDto> {
    return await this.dataSource.transaction(
      async (): Promise<ServantNpVoiceGetResponseDto> => {
        const targetServant = servantId
          ? await this.dumpService.getServantById(servantId)
          : await this.dumpService.getRandomServant();

        if (!targetServant) {
          throw new NotFoundException(
            `Servant with id ${servantId as number} was not found in dump.`,
          );
        }

        // サーヴァントの詳細情報を取得し宝具ボイスレスポンスを生成
        const servantDetail = await this.fgoGameApiService.getServantDetail(
          targetServant.id,
        );

        return new ServantNpVoiceGetResponseDto(servantDetail);
      },
    );
  }
}
