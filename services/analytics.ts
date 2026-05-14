// Analytics seguro: registra apenas eventos de produto, nunca conteúdo do chat/diário/check-in.

export type SafeEventName =
  | 'onboarding_completed'
  | 'checkin_saved'
  | 'chat_message_sent'
  | 'exercise_completed'
  | 'trail_day_completed'
  | 'sos_opened'
  | 'paywall_opened'
  | 'settings_updated';

export const trackSafeEvent = (name: SafeEventName, metadata: Record<string, string | number | boolean> = {}) => {
  const safeMetadata = Object.fromEntries(
    Object.entries(metadata).filter(([key]) => !['text', 'note', 'content', 'message', 'diary'].includes(key.toLowerCase()))
  );

  if ((import.meta as any).env?.DEV) {
    console.info('[safe-event]', name, safeMetadata);
  }

  // Produção: enviar apenas safeMetadata para PostHog/Plausible/Firebase Analytics etc.
};
