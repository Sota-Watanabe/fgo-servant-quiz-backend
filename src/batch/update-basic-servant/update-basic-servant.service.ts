import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import { firstValueFrom } from 'rxjs';

import { CloudStorageGateway } from '@/gateways/cloud-storage.gateway';
import { resolveBasicServantGcsObject } from '@/services/basic-servant-sync.service';

@Injectable()
export class UpdateBasicServantService {
  private readonly logger = new Logger(UpdateBasicServantService.name);
  private readonly apiUrl =
    'https://api.atlasacademy.io/export/JP/basic_servant.json';
  private readonly outputPath = path.join(
    process.cwd(),
    'data',
    'basic_servant.json',
  );

  constructor(
    private readonly httpService: HttpService,
    private readonly cloudStorageGateway: CloudStorageGateway,
  ) {}

  async updateBasicServantData() {
    try {
      this.logger.log('Fetching basic_servant.json from Atlas Academy API...');

      // Atlas Academy APIからデータを取得
      const response = await firstValueFrom(
        this.httpService.get<unknown>(this.apiUrl, {
          headers: {
            'User-Agent': 'fgo-servant-quiz-backend',
          },
        }),
      );

      const data = response.data;

      this.logger.log(
        `Fetched ${Array.isArray(data) ? data.length : 0} servants`,
      );

      // JSONファイルとして保存
      await fs.writeFile(
        this.outputPath,
        JSON.stringify(data, null, 2),
        'utf-8',
      );

      this.logger.log(`Successfully updated ${this.outputPath}`);

      // API は自インスタンスのファイルしか読めないため、共有 GCS にも置く。
      // API は起動時に GCS から取得してローカルファイルへ反映する。
      let gcsUploaded = false;
      if (this.cloudStorageGateway.isConfigured()) {
        try {
          await this.cloudStorageGateway.uploadFile(
            Buffer.from(JSON.stringify(data, null, 2), 'utf-8'),
            resolveBasicServantGcsObject(),
            'application/json',
          );
          gcsUploaded = true;
        } catch (uploadError) {
          this.logger.error(
            'Failed to upload basic_servant.json to GCS',
            uploadError,
          );
        }
      }

      return {
        success: true,
        message: 'basic_servant.json has been updated successfully',
        path: this.outputPath,
        count: Array.isArray(data) ? data.length : 0,
        gcsUploaded,
      };
    } catch (error) {
      this.logger.error('Failed to update basic_servant.json', error);
      throw error;
    }
  }
}
