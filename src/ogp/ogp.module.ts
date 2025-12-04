import { Module } from '@nestjs/common';
import { OgpController } from './ogp.controller';
import { OgpService } from './ogp.service';
import { CloudStorageGateway } from '@/gateways/cloud-storage.gateway';
import { CloudTasksGateway } from '@/gateways/cloud-tasks.gateway';

@Module({
  controllers: [OgpController],
  providers: [OgpService, CloudStorageGateway, CloudTasksGateway],
})
export class OgpModule {}
