import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ServantsOptionsGetResponseDto } from '@/dto/servants-options-get-response.dto';
import { DumpService } from '@/services/dump.service';

@Injectable()
export class GetServantOptionsInteractor {
  constructor(
    private readonly dumpService: DumpService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute(): Promise<ServantsOptionsGetResponseDto> {
    return await this.dataSource.transaction(
      async (): Promise<ServantsOptionsGetResponseDto> => {
        const servants = await this.dumpService.getDumpServants();
        return new ServantsOptionsGetResponseDto(servants);
      },
    );
  }
}
