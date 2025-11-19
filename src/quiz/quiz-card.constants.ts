export const QUIZ_CARD_TYPES = ['skill', 'profile', 'np'] as const;
export type QuizCardType = (typeof QUIZ_CARD_TYPES)[number];

export const QUIZ_CARD_ENDPOINT_MAP: Record<QuizCardType, string> = {
  skill: '/quiz/skill',
  profile: '/quiz/profile',
  np: '/quiz/np',
};

export const normalizeQuizCardType = (
  value?: string,
): QuizCardType | undefined => {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if ((QUIZ_CARD_TYPES as readonly string[]).includes(normalized)) {
    return normalized as QuizCardType;
  }

  return undefined;
};
