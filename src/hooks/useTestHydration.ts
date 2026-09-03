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
        // Try fetching from Supabase first
        // Generate a random offset to fetch different chunks from the massive question bank
        const maxOffset = 10; 
        const randomOffset = Math.floor(Math.random() * maxOffset);
        
        // Check Master Switch
        const { data: settings } = await (supabase as any).from('platform_settings').select('full_pyq_access').eq('id', 'GLOBAL').single();
        const hasAccess = settings?.full_pyq_access || false;
        
        let query = (supabase as any).from('cbt_questions').select('*');
        if (!hasAccess) {
          query = query.eq('is_sample', true).limit(90);
        } else {
          query = query.eq('exam_target', examType).range(randomOffset, randomOffset + 89);
        }

        const { data, error } = await query;

        if (data && data.length > 0) {
          // Cache payload in IndexedDB for offline resilience
          await set(`cbt_cache_${examType}`, data);
          hydrateQuestions(data.map((d: any) => ({
            ...d,
            question_latex: d.question_text,
            correct_index: d.options.findIndex((o: string) => o === d.correct_answer) === -1 ? 0 : d.options.findIndex((o: string) => o === d.correct_answer),
            explanation_latex: d.explanation
          })));
        } else {
          // If no data, perhaps we mock it (useful for local dev)
          loadMockFallback();
        }
      } catch (err) {
        console.error('Supabase fetch failed, trying IndexedDB offline cache...', err);
        const cached = await get(`cbt_cache_${examType}`);
        if (cached) {
          hydrateQuestions((cached as any[]).map((d: any) => ({
            ...d,
            question_latex: d.question_text,
            correct_index: d.options.findIndex((o: string) => o === d.correct_answer) === -1 ? 0 : d.options.findIndex((o: string) => o === d.correct_answer),
            explanation_latex: d.explanation
          })));
        } else {
          loadMockFallback();
        }
      } finally {
        setLoading(false);
      }
    }

    function loadMockFallback() {
      const mockQs: CbtQuestion[] = Array.from({ length: 15 }).map((_, i) => ({
        id: `mock-q-${i}`,
        question_latex: `This is mock question ${i + 1}. Find the derivative of $f(x) = x^2$.`,
        options: ['$2x$', '$x^2/2$', '$x$', '$2$'],
        correct_index: 0,
        explanation_latex: 'The power rule states that $\\frac{d}{dx} x^n = nx^{n-1}$.',
        subject: 'Mathematics',
        chapter: 'Calculus',
        difficulty: 'medium',
      }));
      hydrateQuestions(mockQs);
    }

    loadTest();
  }, [examType, isAdaptive, hydrateQuestions]);

  return { loading };
}
