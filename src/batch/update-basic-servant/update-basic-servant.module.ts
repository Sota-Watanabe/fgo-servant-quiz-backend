import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UpdateBasicServantController } from './update-basic-servant.controller';
import { UpdateBasicServantService } from './update-basic-servant.service';
import { CloudStorageGateway } from '@/gateways/cloud-storage.gateway';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [UpdateBasicServantController],
  providers: [UpdateBasicServantService, CloudStorageGateway],
})
export class UpdateBasicServantModule {}
