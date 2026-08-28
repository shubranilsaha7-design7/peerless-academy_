import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useProctoring(userId: string | null, sessionId: string, isActive: boolean) {
  const infractionsRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive || !userId) return;

    const logInfraction = async (type: string, severity: string) => {
      infractionsRef.current++;
      
      try {
        await (supabase as any).from('proctoring_logs').insert({
          user_id: userId,
          session_id: sessionId,
          event_type: type,
          severity: severity
        });
      } catch (err) {
        console.error('Proctoring log failed', err);
      }
      
      if (infractionsRef.current > 5) {
        alert("Warning: Multiple suspicious activities detected. Your session may be terminated.");
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        logInfraction('visibility_hidden', 'high');
      }
    };

    const handleBlur = () => {
      logInfraction('blur', 'medium');
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logInfraction('copy', 'low');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logInfraction('paste', 'high');
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, [isActive, userId, sessionId]);

  return { infractions: infractionsRef.current };
}
