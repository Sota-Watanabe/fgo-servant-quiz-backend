import { Injectable, Logger } from '@nestjs/common';
import { VertexAI, type GenerateContentResponse } from '@google-cloud/vertexai';

@Injectable()
export class VertexAiGateway {
  private readonly logger = new Logger(VertexAiGateway.name);
  private readonly projectId =
    process.env.VERTEX_AI_PROJECT_ID ?? 'fgo-servant-quiz';
  private readonly location =
    process.env.VERTEX_AI_LOCATION ?? 'asia-northeast1';
  private readonly model = process.env.VERTEX_AI_MODEL ?? 'gemini-2.5-flash';
  private readonly vertexAiClient: VertexAI;

  constructor() {
    const keyFilename = process.env.VERTEX_AI_CREDENTIALS_FILE ?? undefined;

    if (!this.projectId) {
      this.logger.warn(
        'VERTEX_AI_PROJECT_ID is not set. Falling back to auto-detected project from credentials.',
      );
    }

    const initOptions: ConstructorParameters<typeof VertexAI>[0] = {
      location: this.location,
    };

    if (this.projectId) {
      initOptions.project = this.projectId;
    }

    if (keyFilename) {
      initOptions.googleAuthOptions = { keyFilename };
    }

    this.vertexAiClient = new VertexAI(initOptions);
  }

  async generateText(
    prompt: string,
    systemInstruction?: string,
  ): Promise<string> {
    const model = this.vertexAiClient.getGenerativeModel({
      model: this.model,
      ...(systemInstruction
        ? {
            systemInstruction: {
              role: 'system',
              parts: [{ text: systemInstruction }],
            },
          }
        : {}),
    });

    try {
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      });

      const text = (
        result.response as GenerateContentResponse | undefined
      )?.candidates
        ?.flatMap((candidate) => candidate.content?.parts ?? [])
        .map((part) => part.text ?? '')
        .join('')
        .trim();

      if (!text) {
        throw new Error('Vertex AI returned an empty response.');
      }

      return text;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Vertex AI request failed: ${err.message}`, err.stack);
      throw error;
    }
  }
}
