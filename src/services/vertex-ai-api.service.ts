import { Injectable, Logger } from '@nestjs/common';
import { VertexAiGateway } from '@/gateways/vertex-ai.gateway';

@Injectable()
export class VertexAiApiService {
  private readonly logger = new Logger(VertexAiApiService.name);
  private readonly systemInstruction =
    'You are an assistant that rewrites Japanese text for a quiz. Replace any mentions of the given servant or closely related proper nouns with the placeholder 「〇〇〇」. Respond with Japanese text only, without explanations.';

  constructor(private readonly vertexAiGateway: VertexAiGateway) {}

  async maskServantName(
    profileText: string,
    servantName: string,
  ): Promise<string> {
    if (!profileText?.trim()) {
      return '';
    }

    const prompt = this.buildPrompt(profileText, servantName);

    try {
      const maskedText = await this.vertexAiGateway.generateText(
        prompt,
        this.systemInstruction,
      );
      return maskedText.trim();
    } catch (error) {
      this.logger.error(
        `Failed to mask servant name "${servantName}" via Vertex AI. Returning original text.`,
        error as Error,
      );
      return profileText;
    }
  }

  private buildPrompt(profileText: string, servantName: string): string {
    const normalizedProfile = profileText.trim();
    const normalizedName = servantName.trim();

    const nameVariants = normalizedName
      .split(/[\s]+/)
      .filter(Boolean)
      .map((part) => `・${part}`);

    return [
      '以下の文章は、Fate/Grand Order に登場するサーヴァントのプロフィールです。',
      'クイズ用途のため、サーヴァントの名前のみをすべて次の表記で伏せてください。: ` 《秘匿対象》 `',
      '名前は一部だとしても伏せてください。',
      '別名は置き換えないでください。',
      '文章の敬体・語尾・文体は変えず、伏せ字以外の表現はできる限り元の文章を維持してください。',
      '解説や注釈は不要で、伏せ字済みの文章のみを出力してください。',
      '',
      `サーヴァント名（参考）: ${normalizedName}`,
      ...(nameVariants.length > 1
        ? ['名前の構成要素:', ...nameVariants, '']
        : ['']),
      '--- 元の文章 ---',
      normalizedProfile,
    ]
      .filter(Boolean)
      .join('\n');
  }
}
