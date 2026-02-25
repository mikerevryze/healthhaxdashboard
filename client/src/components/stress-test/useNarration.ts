import { useState, useCallback, useRef, useEffect } from "react";

export function useNarration() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    async (text: string) => {
      stop();
      if (!isEnabled || !text) return;

      // Try ElevenLabs if API key is available
      const elevenLabsKey = (window as any).__ELEVENLABS_API_KEY;
      if (elevenLabsKey) {
        try {
          const response = await fetch(
            "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "xi-api-key": elevenLabsKey,
              },
              body: JSON.stringify({
                text,
                model_id: "eleven_monolingual_v1",
                voice_settings: { stability: 0.5, similarity_boost: 0.75 },
              }),
            },
          );
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audioRef.current = audio;
            setIsSpeaking(true);
            audio.onended = () => {
              setIsSpeaking(false);
              URL.revokeObjectURL(url);
            };
            audio.play();
            return;
          }
        } catch {
          // Fall through to Web Speech API
        }
      }

      // Fallback: Web Speech API
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    },
    [isEnabled, stop],
  );

  const toggle = useCallback(() => {
    if (isEnabled) {
      stop();
    }
    setIsEnabled((prev) => !prev);
  }, [isEnabled, stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { isEnabled, isSpeaking, speak, stop, toggle };
}
