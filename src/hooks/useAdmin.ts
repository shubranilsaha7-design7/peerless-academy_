import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user || !user.email) {
          if (mounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        if (mounted) setUserEmail(user.email);

        // Fetch authorized admin emails from platform_settings
        const { data, error } = await supabase
          .from('platform_settings')
          .select('system_prompt')
          .eq('id', 'ADMIN_EMAILS')
          .single();

        if (error || !data) {
          if (mounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        try {
          const emails: string[] = JSON.parse((data as any).system_prompt || '[]');
          if (mounted) setIsAdmin(emails.includes(user.email));
        } catch (e) {
          if (mounted) setIsAdmin(false);
        }
      } catch (e) {
        if (mounted) setIsAdmin(false);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkAdmin();

    return () => {
      mounted = false;
    };
  }, []);

  return { isAdmin, loading, userEmail };
}
