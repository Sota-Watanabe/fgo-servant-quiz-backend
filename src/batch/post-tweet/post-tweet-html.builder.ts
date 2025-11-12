import { buildNoblePhantasmHtml } from './templates/np-template';
import { buildProfileHtml } from './templates/profile-template';
import { buildSkillHtml } from './templates/skill-template';
import {
  makeTitle,
  renderDocument,
  stringifyPayload,
} from './templates/shared';

const buildDefaultHtml = (endpoint: string, payload: unknown): string => {
  const title = makeTitle(endpoint);
  const payloadString = stringifyPayload(payload);
  const content = `<section class="fallback-card">
    <p>専用デザインが未対応のため、生JSONを表示しています。</p>
    <pre>${payloadString}</pre>
  </section>`;

  return renderDocument(title, content, {
    heroTitle: title,
    heroSubtitle: 'Raw payload preview',
  });
};

export const buildHtml = (endpoint: string, payload: unknown): string => {
  if (endpoint.includes('np')) {
    return buildNoblePhantasmHtml(payload);
  }

  if (endpoint.includes('profile')) {
    return buildProfileHtml(payload);
  }

  if (endpoint.includes('skill')) {
    return buildSkillHtml(payload);
  }

  return buildDefaultHtml(endpoint, payload);
};
