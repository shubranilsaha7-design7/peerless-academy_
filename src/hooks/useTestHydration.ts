import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { get, set } from 'idb-keyval';
import { useCbtStore, CbtQuestion } from '@/store/cbtStore';

export function useTestHydration(examType: string, isAdaptive: boolean = false, skip: boolean = false) {
  const [loading, setLoading] = useState(!skip);
  const hydrateQuestions = useCbtStore((s) => s.hydrateQuestions);

  useEffect(() => {
    if (skip) {
      setLoading(false);
      return;
    }
    async function loadTest() {
      setLoading(true);
      try {
        const { data: settings } = await (supabase as any).from('platform_settings').select('full_pyq_access').eq('id', 'GLOBAL').single();
        const hasAccess = settings?.full_pyq_access || false;
        
        let query = (supabase as any).from('pyqs').select('*');
        if (!hasAccess) {
          query = query.eq('is_sample', true).limit(90);
        } else {
          // If we want to fetch NEET vs JEE, the pyqs table has exam_type
          query = query.eq('exam_type', examType).limit(90);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Supabase Sync Error:", error);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          await set(`cbt_cache_${examType}`, data);
          hydrateQuestions(data.map((d: any) => {
            const opts = Array.isArray(d.options_json) ? d.options_json : (typeof d.options_json === 'string' ? JSON.parse(d.options_json || '[]') : []);
            return {
              id: d.id,
              question_latex: d.question_latex,
              options: opts,
              correct_index: d.correct_option,
              explanation_latex: d.solution_latex || 'No explanation available.',
              subject: d.subject,
              chapter: d.topic,
              difficulty: d.difficulty || 'medium',
            };
          }));
        }
      } catch (err) {
        console.error('Supabase fetch failed, trying IndexedDB offline cache...', err);
        const cached = await get(`cbt_cache_${examType}`);
        if (cached) {
          hydrateQuestions((cached as any[]).map((d: any) => {
            const opts = Array.isArray(d.options_json) ? d.options_json : (typeof d.options_json === 'string' ? JSON.parse(d.options_json || '[]') : []);
            return {
              id: d.id,
              question_latex: d.question_latex,
              options: opts,
              correct_index: d.correct_option,
              explanation_latex: d.solution_latex || 'No explanation available.',
              subject: d.subject,
              chapter: d.topic,
              difficulty: d.difficulty || 'medium',
            };
          }));
        }
      } finally {
        setLoading(false);
      }
    }

    loadTest();
  }, [examType, isAdaptive, hydrateQuestions, skip]);

  return { loading };
}
