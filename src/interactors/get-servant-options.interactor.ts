import { Injectable } from '@nestjs/common';
import { ServantService } from '@/services/servant.service';
import { ServantsOptionsGetResponseDto } from '@/dto/servants-options-get-response.dto';

@Injectable()
export class GetServantOptionsInteractor {
  constructor(private readonly servantService: ServantService) {}

  async execute(): Promise<ServantsOptionsGetResponseDto> {
    const servants = await this.servantService.getServantOptions();
    return new ServantsOptionsGetResponseDto(servants);
  }
}
