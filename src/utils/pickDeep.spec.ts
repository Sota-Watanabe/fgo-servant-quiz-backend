import { readFileSync } from 'fs';
import { join } from 'path';
import { pickDeep } from './pickDeep';

describe('pickDeep', () => {
  it('should pick mstSkill[].mstSkill.name from detailRes.json', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const detailRes = JSON.parse(
      readFileSync(join(__dirname, '../../data/detailRes.json'), 'utf-8'),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = pickDeep(detailRes, ['mstSkill[].mstSkill.name']);
    expect(result).toEqual({
      mstSkill: [
        {
          mstSkill: { name: '地獄の軍略 A' },
        },
        {
          mstSkill: { name: '転輪仏塔 B+' },
        },
        {
          mstSkill: { name: '転輪聖王 EX' },
        },
      ],
    });
  });

  it('should pick mstSkill[].mstSkill.name mstSkill[].mstSkill.ruby from detailRes.json', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const detailRes = JSON.parse(
      readFileSync(join(__dirname, '../../data/detailRes.json'), 'utf-8'),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = pickDeep(detailRes, [
      'mstSkill[].mstSkill.name',
      'mstSkill[].mstSkill.ruby',
    ]);
    expect(result).toEqual({
      mstSkill: [
        {
          mstSkill: { name: '地獄の軍略 A', ruby: 'じごくのぐんりゃく' },
        },
        {
          mstSkill: { name: '転輪仏塔 B+', ruby: 'アショカ・ピラー' },
        },
        {
          mstSkill: { name: '転輪聖王 EX', ruby: 'てんりんじょうおう' },
        },
      ],
    });
  });

  it('should pick mstSvt.name mstSkill[].mstSkill.name mstSkill[].mstSkill.ruby from detailRes.json', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const detailRes = JSON.parse(
      readFileSync(join(__dirname, '../../data/detailRes.json'), 'utf-8'),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = pickDeep(detailRes, [
      'mstSvt.name',
      'mstSkill[].mstSkill.name',
      'mstSkill[].mstSkill.ruby',
    ]);
    expect(result).toEqual({
      mstSvt: { name: 'アショカ王' },
      mstSkill: [
        {
          mstSkill: { name: '地獄の軍略 A', ruby: 'じごくのぐんりゃく' },
        },
        {
          mstSkill: { name: '転輪仏塔 B+', ruby: 'アショカ・ピラー' },
        },
        {
          mstSkill: { name: '転輪聖王 EX', ruby: 'てんりんじょうおう' },
        },
      ],
    });
  });

  it('should pick mstSvt.name mstSkill[].mstSkill.name mstSkill[].mstSkill.ruby detail from detailRes.json', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const detailRes = JSON.parse(
      readFileSync(join(__dirname, '../../data/detailRes.json'), 'utf-8'),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = pickDeep(detailRes, [
      'mstSvt.name',
      'mstSvt.ruby',
      'mstSkill[].mstSkill.name',
      'mstSkill[].mstSkill.ruby',
      'mstSkill[].mstSkillDetail[].detail',
    ]);
    expect(result).toEqual({
      mstSvt: { name: 'アショカ王', ruby: 'アショカオウ' },
      mstSkill: [
        {
          mstSkill: { name: '地獄の軍略 A', ruby: 'じごくのぐんりゃく' },
          mstSkillDetail: [
            {
              detail:
                '味方全体のArtsカード性能をアップ[{0}](3ターン)＆Busterカード性能をアップ[{0}](3ターン)＆宝具威力をアップ[{0}](3ターン)',
            },
          ],
        },
        {
          mstSkill: { name: '転輪仏塔 B+', ruby: 'アショカ・ピラー' },
          mstSkillDetail: [
            {
              detail:
                '自身の攻撃力をアップ[{0}](3ターン)＆クリティカル威力をアップ[{0}](3ターン)＆「攻撃時に対象に強化無効状態(1回・1ターン)を付与する状態」を付与(3ターン)',
            },
          ],
        },
        {
          mstSkill: { name: '転輪聖王 EX', ruby: 'てんりんじょうおう' },
          mstSkillDetail: [
            {
              detail:
                '自身のNPを増やす[{0}]＆毎ターンスター獲得状態を付与[{0}](3ターン) ＋ 味方全体の弱体耐性をアップ[{0}](3ターン)＆被クリティカル発生耐性をアップ[{0}](3ターン)',
            },
          ],
        },
      ],
    });
  });
});
