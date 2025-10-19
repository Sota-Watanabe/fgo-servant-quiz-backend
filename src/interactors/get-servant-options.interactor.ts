import { Injectable } from '@nestjs/common';
import { ServantsOptionsGetResponseDto } from '@/dto/servants-options-get-response.dto';
import { DumpService } from '@/services/dump.service';

@Injectable()
export class GetServantOptionsInteractor {
  constructor(private readonly dumpService: DumpService) {}

  async execute(): Promise<ServantsOptionsGetResponseDto> {
    const servants = await this.dumpService.getDumpServants();
    return new ServantsOptionsGetResponseDto(servants);
  }
}
