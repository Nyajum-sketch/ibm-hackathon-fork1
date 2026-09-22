import { useState, useCallback, useEffect, useRef } from 'react';
import { translateText } from '../lib/translate';
import { useCaptionStore } from '../store/useCaptionStore';
import { useSettingsStore } from '../store/useSettingsStore';

export function useTranslation() {
  const { actions, interimText, finalTranscript } = useCaptionStore();
  const { targetLanguage, autoTranslate } = useSettingsStore();
  const [isTranslating, setIsTranslating] = useState(false);
  const debounceTimerRef = useRef(null);

  const translateLine = useCallback(async (text, index) => {
    if (!text || !text.trim() || !autoTranslate || targetLanguage === 'en') {
      return;
    }

    setIsTranslating(true);
    try {
      const translated = await translateText(text, targetLanguage);
      actions.setTranslatedLine(index, translated);
    } catch (err) {
      console.error('Translation hook failed:', err);
    } finally {
      setIsTranslating(false);
    }
  }, [actions, targetLanguage, autoTranslate]);

  const translateAll = useCallback(async (lines) => {
    if (!lines || lines.length === 0 || !autoTranslate || targetLanguage === 'en') {
      return;
    }
    setIsTranslating(true);
    try {
      await Promise.all(
        lines.map(async (line, idx) => {
          if (line && line.trim()) {
            const translated = await translateText(line, targetLanguage);
            actions.setTranslatedLine(idx, translated);
          }
        })
      );
    } catch (err) {
      console.error('Translate all lines failed:', err);
    } finally {
      setIsTranslating(false);
    }
  }, [actions, targetLanguage, autoTranslate]);

  // Real-time interim translation debouncer
  useEffect(() => {
    clearTimeout(debounceTimerRef.current);

    if (!interimText || !interimText.trim() || !autoTranslate || targetLanguage === 'en') {
      actions.setInterimTranslation('');
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const translated = await translateText(interimText, targetLanguage);
        actions.setInterimTranslation(translated);
      } catch (e) {
        console.warn('Real-time interim translation failed:', e);
      }
    }, 250);

    return () => clearTimeout(debounceTimerRef.current);
  }, [interimText, autoTranslate, targetLanguage, actions]);

  // Re-translate existing transcript whenever targetLanguage or autoTranslate changes
  useEffect(() => {
    if (autoTranslate && targetLanguage !== 'en' && finalTranscript.length > 0) {
      translateAll(finalTranscript);
    }
  }, [targetLanguage, autoTranslate]);

  return {
    translateLine,
    translateAll,
    isTranslating,
    targetLanguage
  };
}
