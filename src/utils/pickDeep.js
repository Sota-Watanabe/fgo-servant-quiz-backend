/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

export function pickDeep(obj, keys) {
  const result = {};

  for (const key of keys) {
    const parts = key.split('.');
    let currentSrc = obj;
    let currentDst = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (currentSrc == null) break;

      if (Array.isArray(currentSrc)) {
        // 配列なら各要素に再帰的に処理
        currentDst[part] = currentSrc.map((item) =>
          pickDeep(item, [parts.slice(i).join('.')]),
        );
        break;
      }

      if (i === parts.length - 1) {
        // 最後のキーなら値をコピー
        currentDst[part] = currentSrc[part];
      } else {
        // 中間ノードを作成
        if (!(part in currentDst)) {
          currentDst[part] = {};
        }
        currentDst = currentDst[part];
        currentSrc = currentSrc[part];
      }
    }
  }

  return result;
}

// 使用例
// const data = {
//   mstSvt: {
//     name: 'アショカ王',
//     ruby: 'アショカオウ',
//     mstSkill: [
//       {
//         mstSkill: { name: 'スキルA' },
//         mstSkillDetail: { detail: '説明A' },
//       },
//       {
//         mstSkill: { name: 'スキルB' },
//         mstSkillDetail: { detail: '説明B' },
//       },
//     ],
//   },
// };

// const keys = [
//   'mstSvt.name',
//   'mstSvt.ruby',
//   'mstSvt.mstSkill.mstSkill.name',
//   'mstSvt.mstSkill.mstSkillDetail.detail',
// ];

// console.log(JSON.stringify(pickDeep(data, keys), null, 2));
