import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UpdateBasicServantController } from './update-basic-servant.controller';
import { UpdateBasicServantService } from './update-basic-servant.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [UpdateBasicServantController],
  providers: [UpdateBasicServantService],
})
export class UpdateBasicServantModule {}
