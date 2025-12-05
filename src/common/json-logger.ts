/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { LoggerService, LogLevel } from '@nestjs/common';

/**
 * ログオブジェクトの型定義
 */
interface LogObject {
  severity: string;
  timestamp: string;
  message: string;
  context?: string;
  params?: any[];
  trace?: string;
  errorContext?: any;
}

/**
 * JSON 形式でログを出力する Logger Service
 * Cloud Logging での可視性を向上させるため、構造化ログを出力します
 */
export class JsonLogger implements LoggerService {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  /**
   * 通常ログ (INFO レベル)
   */
  log(message: any, ...optionalParams: any[]) {
    this.printLog('INFO', message, optionalParams);
  }

  /**
   * エラーログ (ERROR レベル)
   */
  error(message: any, ...optionalParams: any[]) {
    const trace = optionalParams.find((param) => typeof param === 'string');
    const context = optionalParams.find((param) => typeof param === 'object');
    this.printLog('ERROR', message, [], trace, context);
  }

  /**
   * 警告ログ (WARNING レベル)
   */
  warn(message: any, ...optionalParams: any[]) {
    this.printLog('WARNING', message, optionalParams);
  }

  /**
   * デバッグログ (DEBUG レベル)
   */
  debug(message: any, ...optionalParams: any[]) {
    this.printLog('DEBUG', message, optionalParams);
  }

  /**
   * 詳細ログ (DEBUG レベル)
   */
  verbose(message: any, ...optionalParams: any[]) {
    this.printLog('DEBUG', message, optionalParams);
  }

  /**
   * ログレベルを設定 (実装不要だが LoggerService インターフェースのため定義)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLogLevels?(levels: LogLevel[]) {
    // 必要に応じて実装
  }

  /**
   * JSON 形式でログを出力する共通メソッド
   */
  private printLog(
    severity: string,
    message: any,
    optionalParams: any[],
    trace?: string,
    errorContext?: any,
  ) {
    const timestamp = new Date().toISOString();
    const context = this.extractContext(optionalParams) || this.context;

    const logObject: LogObject = {
      severity, // Cloud Logging が認識する標準フィールド
      timestamp,
      message: this.formatMessage(message),
    };

    // コンテキストがあれば追加
    if (context) {
      logObject.context = context;
    }

    // オプションパラメータを追加
    if (optionalParams && optionalParams.length > 0) {
      const params = optionalParams.filter(
        (param) => typeof param !== 'string' || param !== context,
      );
      if (params.length > 0) {
        logObject.params = params;
      }
    }

    // エラーの場合はスタックトレースを追加
    if (severity === 'ERROR' && trace) {
      logObject.trace = trace;
    }

    // エラーコンテキストがあれば追加
    if (errorContext) {
      logObject.errorContext = errorContext;
    }

    // JSON 形式で出力
    console.log(JSON.stringify(logObject));
  }

  /**
   * メッセージを文字列に整形
   */
  private formatMessage(message: any): string {
    if (typeof message === 'string') {
      return message;
    }
    if (message instanceof Error) {
      return message.message;
    }
    if (typeof message === 'object') {
      return JSON.stringify(message);
    }
    return String(message);
  }

  /**
   * オプションパラメータからコンテキストを抽出
   */
  private extractContext(optionalParams: any[]): string | undefined {
    if (optionalParams.length === 0) {
      return undefined;
    }
    const lastParam = optionalParams[optionalParams.length - 1];
    if (typeof lastParam === 'string') {
      return lastParam;
    }
    return undefined;
  }
}
