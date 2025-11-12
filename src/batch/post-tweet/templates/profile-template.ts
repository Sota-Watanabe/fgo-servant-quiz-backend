import {
  escapeHtml,
  formatMultiline,
  getString,
  isRecord,
  renderDocument,
  renderFallback,
} from './shared';

const policyLabels: Record<string, string> = {
  lawful: '秩序',
  neutral: '中庸',
  chaotic: '混沌',
};

const personalityLabels: Record<string, string> = {
  good: '善',
  evil: '悪',
  balanced: '中庸',
  summer: '夏',
  madness: '狂',
  bride: '花嫁',
};

const normalizePolicyLabel = (policy?: string): string => {
  if (!policy) {
    return '不明';
  }
  const normalized = policy.toLowerCase();
  return policyLabels[normalized] ?? '不明';
};

const normalizePersonalityLabel = (personality?: string): string => {
  if (!personality) {
    return '不明';
  }
  const normalized = personality.toLowerCase();
  return personalityLabels[normalized] ?? '不明';
};

export const buildProfileHtml = (payload: unknown): string => {
  const safePayload = isRecord(payload) ? payload : {};
  const baseProfile = isRecord(safePayload.baseProfile)
    ? safePayload.baseProfile
    : null;
  const stats = isRecord(safePayload.stats) ? safePayload.stats : null;

  const profileComment = baseProfile
    ? getString(baseProfile.comment).trim()
    : '';

  if (!profileComment) {
    return renderFallback(
      '/quiz/profile',
      payload,
      'プロフィール情報を取得できませんでした。レスポンスを確認してください。',
    );
  }

  const condMessage = baseProfile
    ? getString(baseProfile.condMessage).trim()
    : '';

  const statusEntries = [
    { label: '筋力', value: getString(stats?.strength) },
    { label: '耐久', value: getString(stats?.endurance) },
    { label: '敏捷', value: getString(stats?.agility) },
    { label: '魔力', value: getString(stats?.magic) },
    { label: '幸運', value: getString(stats?.luck) },
    { label: '宝具', value: getString(stats?.np) },
  ];

  const policyLabel = normalizePolicyLabel(getString(stats?.policy));
  const personalityLabel = normalizePersonalityLabel(
    getString(stats?.personality),
  );

  statusEntries.push({
    label: '属性',
    value: `${policyLabel}・${personalityLabel}`,
  });

  const statusHtml = statusEntries
    .map(
      (entry) => `<div class="status-card">
        <p class="status-label">${escapeHtml(entry.label)}</p>
        <p class="status-value">${escapeHtml(entry.value || '-')}</p>
      </div>`,
    )
    .join('');

  const relatedInfo = [
    { label: 'CV', value: getString(safePayload.cv) },
    { label: 'イラストレーター', value: getString(safePayload.illustrator) },
  ].filter((info) => info.value);

  const relatedHtml = relatedInfo.length
    ? `<div class="related-grid">
        ${relatedInfo
          .map(
            (info) => `<div class="related-card">
              <p class="related-label">${escapeHtml(info.label)}</p>
              <p class="related-value">${escapeHtml(info.value)}</p>
            </div>`,
          )
          .join('')}
      </div>`
    : '';

  const content = `<section class="question-card profile-card">
    <h2 class="question-title">このプロフィールを持つサーヴァントは？</h2>
    <div class="profile-section">
      <div class="profile-section__inner">
        <div class="profile-label">
          <span>プロフィール</span>
          ${
            condMessage
              ? `<span class="profile-cond-pill">${escapeHtml(
                  condMessage,
                )}</span>`
              : ''
          }
        </div>
        <p class="profile-text">${formatMultiline(profileComment)}</p>
      </div>
    </div>
    <div class="status-grid">
      ${statusHtml}
    </div>
    ${relatedHtml}
  </section>`;

  return renderDocument('プロフィール クイズ問題', content);
};
