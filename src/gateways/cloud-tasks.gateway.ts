/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { CloudTasksClient } from '@google-cloud/tasks';
import { QuizCardType } from '@/quiz/quiz-card.constants';

@Injectable()
export class CloudTasksGateway {
  private readonly logger = new Logger(CloudTasksGateway.name);
  private client: any = null;
  private projectId: string;
  private location: string;
  private queueName: string;
  private serviceUrl: string;

  constructor() {
    this.projectId = process.env.GCP_PROJECT_ID || '';
    this.location = process.env.CLOUD_TASKS_LOCATION || '';
    this.queueName = process.env.CLOUD_TASKS_QUEUE_NAME || '';
    this.serviceUrl = process.env.BATCH_SERVICE_URL || '';

    if (this.projectId && this.serviceUrl) {
      this.client = new CloudTasksClient();
      this.logger.log(
        `Cloud Tasks initialized: ${this.projectId}/${this.location}/${this.queueName}`,
      );
    } else {
      this.logger.warn(
        'Cloud Tasks is not configured. Tasks will not be created.',
      );
    }
  }

  isConfigured(): boolean {
    this.logger.warn(
      `Cloud Tasks not configured. Skipping task creation for ${this.client}/${this.projectId}/${this.serviceUrl}`,
    );
    return this.client !== null && !!this.projectId && !!this.serviceUrl;
  }

  /**
   * OGP画像生成タスクをキューに追加
   * @param type クイズタイプ
   * @param servantId サーヴァントID
   */
  async createOgpGenerationTask(
    type: QuizCardType,
    servantId: number,
  ): Promise<void> {
    if (!this.client || !this.isConfigured()) {
      this.logger.warn(
        `Cloud Tasks not configured. Skipping task creation for ${type}/${servantId}`,
      );
      return;
    }

    const parent = this.client.queuePath(
      this.projectId,
      this.location,
      this.queueName,
    );

    const url = `${this.serviceUrl}/batch/create-ogp?type=${type}&servantId=${servantId}`;

    const task = {
      httpRequest: {
        httpMethod: 'POST' as const,
        url,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    };

    try {
      const [response] = await this.client.createTask({ parent, task });
      this.logger.log(
        `Created task ${response.name} for OGP generation: ${type}/${servantId}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create Cloud Task: ${message}`);
      throw error;
    }
  }
}
