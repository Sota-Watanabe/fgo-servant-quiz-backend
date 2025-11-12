import {
  escapeHtml,
  formatMultiline,
  getString,
  isRecord,
  renderDocument,
  renderFallback,
} from './shared';

const cardTypeLabels: Record<number, string> = {
  1: 'アーツ',
  2: 'バスター',
  3: 'クイック',
};

const formatCardLabel = (cardRaw: string): string => {
  if (!cardRaw) {
    return 'カード情報なし';
  }
  const parsed = Number(cardRaw);
  if (!Number.isNaN(parsed) && cardTypeLabels[parsed]) {
    return cardTypeLabels[parsed];
  }
  return cardRaw;
};

export const buildNoblePhantasmHtml = (payload: unknown): string => {
  const safePayload = isRecord(payload) ? payload : {};
  const noblePhantasmRecord = isRecord(safePayload.noblePhantasm)
    ? safePayload.noblePhantasm
    : null;

  if (!noblePhantasmRecord) {
    return renderFallback(
      '/quiz/np',
      payload,
      '宝具情報を取得できませんでした。レスポンスを確認してください。',
    );
  }

  const npName =
    getString(noblePhantasmRecord.name) || '宝具名を取得できませんでした';
  const npRuby = getString(noblePhantasmRecord.ruby);
  const npRank = getString(noblePhantasmRecord.rank) || '??';
  const npType = getString(noblePhantasmRecord.type) || '??';
  const npCard = formatCardLabel(getString(noblePhantasmRecord.card));
  const npDetail = getString(noblePhantasmRecord.detail);

  const detailHtml = npDetail
    ? `<p class="np-detail">${formatMultiline(npDetail)}</p>`
    : '<p class="np-detail np-detail--muted">宝具詳細は現在取得できません。</p>';

  const metaHtml = [
    { label: 'ランク', value: npRank },
    { label: '種別', value: npType },
    { label: 'カード', value: npCard },
  ]
    .map(
      (item) => `<div class="meta-card">
        <p class="meta-label">${escapeHtml(item.label)}</p>
        <p class="meta-value">${escapeHtml(item.value || '-')}</p>
      </div>`,
    )
    .join('');

  const content = `<section class="question-card np-card">
    <div class="np-details">
      <h2 class="question-title">この宝具を持つサーヴァントは？</h2>
      <h3 class="np-name">${escapeHtml(npName)}</h3>
      ${npRuby ? `<p class="np-ruby">${escapeHtml(npRuby)}</p>` : '<div></div>'}
      <div class="meta-grid">
        ${metaHtml}
      </div>
      ${detailHtml}
    </div>
  </section>`;

  return renderDocument('宝具 クイズ問題', content);
};
