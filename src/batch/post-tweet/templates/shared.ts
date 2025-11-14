const makeTitle = (endpoint: string): string => {
  if (endpoint.includes('skill')) {
    return 'スキル クイズ結果';
  }
  if (endpoint.includes('profile')) {
    return 'プロフィール クイズ結果';
  }
  if (endpoint.includes('np')) {
    return '宝具 クイズ結果';
  }
  return 'FGO クイズ結果';
};

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const getString = (value: unknown): string =>
  typeof value === 'string' ? value : '';

export const getNumber = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : undefined;

export const formatMultiline = (value: string): string =>
  escapeHtml(value).replace(/\n/g, '<br />');

export const stringifyPayload = (payload: unknown): string =>
  escapeHtml(JSON.stringify(payload, null, 2) ?? 'undefined');

const getTodayLabel = (): string => {
  try {
    return new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
};

const baseStyles = `
  :root {
    color-scheme: dark;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    min-height: 100vh;
    padding: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 10% 20%, #0ea5e9 0%, #0f172a 55%);
    font-family: 'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif;
    color: #0f172a;
  }
  .page {
    width: 900px;
    background: linear-gradient(180deg, rgba(248, 250, 252, 0.95), #e2e8f0);
    border-radius: 32px;
    padding: 40px;
    box-shadow: 0 40px 70px rgba(15, 23, 42, 0.45);
    border: 1px solid rgba(148, 163, 184, 0.4);
  }
  .hero {
    text-align: center;
    margin-bottom: 32px;
  }
  .hero-eyebrow {
    display: inline-flex;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: rgba(14, 165, 233, 0.15);
    color: #0284c7;
  }
  .hero-title {
    font-size: 34px;
    margin: 16px 0 12px;
    font-weight: 800;
    color: #0f172a;
  }
  .hero-subtitle {
    margin: 0;
    color: #334155;
    font-size: 16px;
    letter-spacing: 0.02em;
  }
  .question-card {
    position: relative;
    border-radius: 28px;
    padding: 32px;
    border: 1px solid rgba(226, 232, 240, 0.9);
    background: rgba(248, 250, 252, 0.95);
    box-shadow: 0 25px 50px rgba(15, 23, 42, 0.12);
  }
  .question-title {
    font-size: 32px;
    font-weight: 800;
    margin: 0 0 24px;
    text-align: center;
    color: #0f172a;
  }
  .np-card {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.95),
      rgba(226, 232, 240, 0.85)
    );
  }
  .np-details {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(14, 165, 233, 0.15);
    color: #0284c7;
    border-radius: 999px;
    padding: 6px 16px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .np-name {
    font-size: 44px;
    font-weight: 800;
    margin: 0;
    color: #0f172a;
    text-align: center;
  }
  .np-ruby {
    font-size: 18px;
    font-weight: 600;
    color: #0ea5e9;
    margin: 0;
    text-align: center;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  .meta-card {
    border-radius: 18px;
    padding: 16px 18px;
    background: #f8fafc;
    border: 1px solid rgba(226, 232, 240, 0.9);
    text-align: center;
  }
  .meta-label {
    margin: 0;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.25em;
    color: #64748b;
  }
  .meta-value {
    margin: 8px 0 0;
    font-size: 26px;
    font-weight: 700;
    color: #0f172a;
  }
  .np-detail {
    margin: 0;
    padding: 18px 20px;
    border-radius: 20px;
    border: 1px solid rgba(14, 165, 233, 0.2);
    background: rgba(14, 165, 233, 0.08);
    color: #0f172a;
    line-height: 1.6;
    font-size: 18px;
  }
  .np-detail--muted {
    color: #475569;
    background: rgba(148, 163, 184, 0.15);
    border-color: rgba(148, 163, 184, 0.25);
    text-align: center;
  }
  .chip-group {
    margin-top: 6px;
  }
  .chip-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #94a3b8;
    margin-bottom: 10px;
  }
  .chip-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .chip {
    display: inline-flex;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.08);
    color: #0f172a;
    font-size: 13px;
    font-weight: 600;
  }
  .chip--muted {
    background: rgba(148, 163, 184, 0.2);
    color: #475569;
  }
  .profile-card {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.95),
      rgba(191, 219, 254, 0.5)
    );
  }
  .profile-section {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid rgba(14, 165, 233, 0.2);
    background: linear-gradient(
      120deg,
      rgba(14, 165, 233, 0.08),
      rgba(191, 219, 254, 0.4)
    );
    padding: 24px;
    margin-bottom: 24px;
  }
  .profile-section::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at top right,
      rgba(14, 165, 233, 0.35),
      transparent 65%
    );
    opacity: 0.3;
  }
  .profile-section__inner {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .profile-label {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #0369a1;
  }
  .profile-cond-pill {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    background: rgba(14, 165, 233, 0.18);
    color: #0f172a;
    padding: 4px 12px;
    font-size: 11px;
    letter-spacing: 0.08em;
  }
  .profile-text {
    margin: 0;
    font-size: 15px;
    line-height: 1.7;
    color: #0f172a;
  }
  .status-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 24px;
  }
  .status-card {
    border-radius: 18px;
    border: 1px solid rgba(99, 102, 241, 0.25);
    background: rgba(255, 255, 255, 0.9);
    text-align: center;
    padding: 16px 12px;
  }
  .status-label {
    margin: 0;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #6366f1;
  }
  .status-value {
    margin: 8px 0 0;
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
  }
  .related-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .related-card {
    flex: 1 1 220px;
    border-radius: 18px;
    border: 1px solid rgba(251, 191, 36, 0.3);
    background: rgba(255, 255, 255, 0.92);
    padding: 16px;
    text-align: center;
  }
  .related-label {
    margin: 0;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    color: #b45309;
  }
  .related-value {
    margin: 8px 0 0;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
  }
  .skill-card {
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.12),
      rgba(191, 219, 254, 0.4)
    );
  }
  .skill-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .skill-item {
    border-radius: 20px;
    border: 1px solid rgba(59, 130, 246, 0.3);
    background: rgba(255, 255, 255, 0.92);
    padding: 20px;
  }
  .skill-name {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: #1d4ed8;
  }
  .skill-ruby {
    margin-left: 8px;
    font-size: 12px;
    font-weight: 600;
    color: #2563eb;
  }
  .skill-detail {
    margin: 12px 0 0;
    font-size: 14px;
    line-height: 1.6;
    color: #0f172a;
  }
  .empty-state,
  .fallback-card {
    border-radius: 24px;
    padding: 28px;
    border: 1px dashed rgba(148, 163, 184, 0.7);
    background: rgba(248, 250, 252, 0.7);
    text-align: center;
    color: #475569;
  }
  .fallback-card pre {
    text-align: left;
    margin-top: 18px;
    padding: 18px;
    border-radius: 18px;
    background: #0f172a;
    color: #f8fafc;
    max-height: 340px;
    overflow: auto;
    font-size: 13px;
  }
  .footer {
    margin-top: 32px;
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #475569;
    border-top: 1px solid rgba(148, 163, 184, 0.4);
    padding-top: 18px;
  }
  @media (max-width: 860px) {
    body {
      padding: 24px;
    }
    .page {
      width: 100%;
    }
    .meta-grid,
    .status-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`;

export const renderDocument = (
  pageTitle: string,
  mainContent: string,
  options: { heroTitle?: string; heroSubtitle?: string } = {},
): string => {
  const todayLabel = getTodayLabel();
  const heroTitle = options.heroTitle?.trim();
  const heroSubtitle = options.heroSubtitle?.trim();

  const heroHtml = heroTitle
    ? `<header class="hero">
        <div class="hero-eyebrow">FGO Servant Quiz</div>
        <h1 class="hero-title">${escapeHtml(heroTitle)}</h1>
        <p class="hero-subtitle">${escapeHtml(heroSubtitle ?? '')}</p>
      </header>`
    : '';

  return `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=900, initial-scale=1" />
    <title>${escapeHtml(pageTitle)}</title>
    <style>${baseStyles}</style>
  </head>
  <body>
    <div class="page">
      ${heroHtml}
      ${mainContent}
      <footer class="footer">
        <span>presented by Fate/Grand Quiz</span>
        <span>${escapeHtml(todayLabel)}</span>
      </footer>
    </div>
  </body>
</html>`;
};

export const renderFallback = (
  endpoint: string,
  payload: unknown,
  message: string,
): string => {
  const title = makeTitle(endpoint);
  const payloadString = stringifyPayload(payload);
  const content = `<section class="fallback-card">
    <p>${escapeHtml(message)}</p>
    <pre>${payloadString}</pre>
  </section>`;

  return renderDocument(title, content, {
    heroTitle: title,
    heroSubtitle: 'Raw payload preview',
  });
};

export { makeTitle };
