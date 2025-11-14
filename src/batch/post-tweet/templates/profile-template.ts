import {
  formatMultiline,
  getString,
  isRecord,
  renderDocument,
  renderFallback,
} from './shared';

export const buildProfileHtml = (payload: unknown): string => {
  const safePayload = isRecord(payload) ? payload : {};
  const baseProfile = isRecord(safePayload.baseProfile)
    ? safePayload.baseProfile
    : null;

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

  const content = `<section class="question-card profile-card">
    <h2 class="question-title">このプロフィールを持つサーヴァントは？</h2>
    <div class="profile-section">
      <p class="profile-text">${formatMultiline(profileComment)}</p>
    </div>
  </section>`;

  return renderDocument('プロフィール クイズ問題', content);
};
