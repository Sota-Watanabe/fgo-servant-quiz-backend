import {
  TemplateRenderOptions,
  escapeHtml,
  formatMultiline,
  getNumber,
  getString,
  isRecord,
  renderDocument,
  renderFallback,
} from './shared';

type SkillRecord = {
  id?: number;
  num?: number;
  name: string;
  ruby: string;
  detail: string;
  priority: number;
};

const normalizeSkills = (value: unknown): SkillRecord[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (isRecord(item) ? item : null))
    .filter((item): item is Record<string, unknown> => item !== null)
    .map((item) => ({
      id: getNumber(item.id),
      num: getNumber(item.num),
      name: getString(item.name),
      ruby: getString(item.ruby),
      detail: getString(item.detail),
      priority: getNumber(item.priority) ?? 0,
    }));
};

const getDisplaySkills = (skills: SkillRecord[]): SkillRecord[] => {
  return skills
    .reduce((acc, skill) => {
      if (skill.num === undefined) {
        acc.push(skill);
        return acc;
      }

      const existingIndex = acc.findIndex((s) => s.num === skill.num);

      if (existingIndex === -1) {
        acc.push(skill);
      } else if ((skill.priority ?? 0) > (acc[existingIndex].priority ?? 0)) {
        acc[existingIndex] = skill;
      }

      return acc;
    }, [] as SkillRecord[])
    .sort((a, b) => {
      const aNum = typeof a.num === 'number' ? a.num : Number.MAX_SAFE_INTEGER;
      const bNum = typeof b.num === 'number' ? b.num : Number.MAX_SAFE_INTEGER;

      if (aNum !== bNum) {
        return aNum - bNum;
      }

      return (b.priority ?? 0) - (a.priority ?? 0);
    })
    .slice(0, 3);
};

export const buildSkillHtml = (
  payload: unknown,
  options: TemplateRenderOptions = {},
): string => {
  const safePayload = isRecord(payload) ? payload : {};
  const normalizedSkills = getDisplaySkills(
    normalizeSkills(safePayload.skills),
  );

  if (!normalizedSkills.length) {
    return renderFallback(
      '/quiz/skill',
      payload,
      'スキル情報を取得できませんでした。レスポンスを確認してください。',
      { isOgp: options.isOgp },
    );
  }

  const skillsHtml = normalizedSkills
    .map(
      (skill) => `<article class="skill-item">
        <h3 class="skill-name">
          ${escapeHtml(skill.name || '名称未設定')}${
            skill.ruby
              ? `<span class="skill-ruby">(${escapeHtml(skill.ruby)})</span>`
              : ''
          }
        </h3>
        <p class="skill-detail">${
          skill.detail
            ? formatMultiline(skill.detail)
            : 'スキル詳細が読み込まれていません'
        }</p>
      </article>`,
    )
    .join('');

  const content = `<section class="question-card skill-card">
    <h2 class="question-title">このスキルを持つサーヴァントは？</h2>
    <div class="skill-list">
      ${skillsHtml}
    </div>
  </section>`;

  return renderDocument('スキル クイズ問題', content, {
    isOgp: options.isOgp,
  });
};
