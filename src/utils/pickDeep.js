export function pickDeep(obj, keys) {
  function setDeep(pathArr, value) {
    if (pathArr.length === 0) return value;
    const key = pathArr[0];
    if (key.endsWith('[]')) {
      const arrKey = key.slice(0, -2);
      if (!Array.isArray(value[arrKey])) return undefined;
      return { [arrKey]: value[arrKey].map((item) => setDeep(pathArr.slice(1), item)) };
    } else {
      if (value == null || !(key in value)) return undefined;
      return { [key]: setDeep(pathArr.slice(1), value[key]) };
    }
  }

  /**
   * @param {Record<string, any>} target
   * @param {Record<string, any>} source
   */
  function deepMerge(target, source) {
    for (const key in source) {
      const tVal = target[key];
      const sVal = source[key];
      if (Array.isArray(sVal) && Array.isArray(tVal)) {
        for (let i = 0; i < sVal.length; i++) {
          if (typeof tVal[i] === 'object' && typeof sVal[i] === 'object') {
            deepMerge(tVal[i], sVal[i]);
          } else if (sVal[i] !== undefined) {
            tVal[i] = sVal[i];
          }
        }
      } else if (sVal && typeof sVal === 'object' && !Array.isArray(sVal)) {
        if (!tVal) target[key] = {};
        deepMerge(target[key], sVal);
      } else {
        target[key] = sVal;
      }
    }
    return target;
  }

  const result = {};
  for (const keyPath of keys) {
    const pathArr = keyPath.split('.');
    const picked = setDeep(pathArr, obj);
    if (picked) {
      deepMerge(result, picked);
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
