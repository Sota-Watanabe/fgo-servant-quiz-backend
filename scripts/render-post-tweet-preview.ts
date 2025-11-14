import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { buildHtml } from '@/batch/post-tweet/post-tweet-html.builder';

type Endpoint = '/quiz/np' | '/quiz/skill' | '/quiz/profile';

const endpointList: Endpoint[] = ['/quiz/np', '/quiz/skill', '/quiz/profile'];

const defaultPayloads: Record<Endpoint, unknown> = {
  '/quiz/np': {
    id: 100100,
    name: 'アルトリア・ペンドラゴン',
    noblePhantasm: {
      name: '約束された勝利の剣',
      ruby: 'エクスカリバー',
      rank: 'EX',
      type: '対城宝具',
      card: '2',
      detail:
        '敵全体に超強力な攻撃[Lv.]\n＆味方全体のNPを少し増やす<br />オーバーチャージで味方全体の攻撃力をアップ(3T)',
    },
  },
  '/quiz/skill': {
    skills: [
      {
        num: 1,
        name: '魔力放出 A',
        ruby: 'まりょくほうしゅつ',
        detail: '自身のバスター性能をアップ(1T)\n＆クリティカル威力アップ(1T)',
      },
      {
        num: 2,
        name: '直感 B',
        ruby: 'ちょっかん',
        detail:
          'スターを大量獲得\n＆味方全体のクリティカル発生率を少しアップ(3T)',
      },
      {
        num: 3,
        name: '嵐の王 EX',
        ruby: 'らんのきみ',
        detail:
          '味方全体の攻撃力をアップ(3T)\n＆被ダメージカット状態を付与(3回)',
      },
    ],
  },
  '/quiz/profile': {
    baseProfile: {
      comment:
        'ブリテンを統べる王にして、湖の騎士に選定された少女。\n幼いころより剣技を磨き、国と民のために戦い続けたという。\nその出自や人格を知る者は少なく、謎多き存在である。',
      condMessage: '霊基第2段階で開放',
    },
  },
};

type CliOptions = {
  endpoint: Endpoint;
  payloadPath?: string;
  outputDir: string;
};

const parseArgs = (): CliOptions => {
  let endpoint: Endpoint = '/quiz/np';
  let payloadPath: string | undefined;
  let outputDir = path.join(process.cwd(), 'data');

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--endpoint=')) {
      const value = arg.replace('--endpoint=', '') as Endpoint;
      endpoint = endpointList.includes(value) ? value : endpoint;
      continue;
    }
    if (arg.startsWith('--payload=')) {
      payloadPath = arg.replace('--payload=', '');
      continue;
    }
    if (arg.startsWith('--output=')) {
      outputDir = path.resolve(arg.replace('--output=', ''));
      continue;
    }
  }

  return { endpoint, payloadPath, outputDir };
};

const loadPayload = (payloadPath: string): unknown => {
  const absolutePath = path.resolve(payloadPath);
  const raw = fs.readFileSync(absolutePath, 'utf8');
  return JSON.parse(raw);
};

const formatTimestamp = (): string =>
  new Date().toISOString().replace(/[:.]/g, '-');

async function main(): Promise<void> {
  const { endpoint, payloadPath, outputDir } = parseArgs();
  const payload =
    payloadPath !== undefined
      ? loadPayload(payloadPath)
      : defaultPayloads[endpoint];

  if (!payload) {
    throw new Error(
      'Payload is empty. Provide --payload=<path> or add a default payload.',
    );
  }

  const html = buildHtml(endpoint, payload);
  fs.mkdirSync(outputDir, { recursive: true });

  const suffix = `${endpoint.split('/').pop()}-${formatTimestamp()}`;
  const htmlPath = path.join(
    outputDir,
    `post-tweet-preview-${suffix}.html`,
  ) as `${string}.html`;
  const imagePath = path.join(
    outputDir,
    `post-tweet-preview-${suffix}.png`,
  ) as `${string}.png`;

  fs.writeFileSync(htmlPath, html, 'utf8');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 900, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: imagePath, type: 'png', fullPage: true });
  } finally {
    await browser.close();
  }

  console.log(
    [
      `✅ Preview generated for ${endpoint}`,
      `HTML : ${htmlPath}`,
      `Image: ${imagePath}`,
    ].join('\n'),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
