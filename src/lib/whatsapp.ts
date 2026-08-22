import type { Question } from '@/data/questions';

export function buildDppMessage(opts: {
  title?: string;
  klass?: number | string;
  subject?: string;
  questions: Question[];
  includeAnswerKey?: boolean;
}): string {
  const { title = 'Peerless Academy · Daily Practice Problems', klass, subject, questions, includeAnswerKey = true } = opts;

  const meta = [klass ? `Class ${klass}` : null, subject, new Date().toLocaleDateString('en-IN')]
    .filter(Boolean)
    .join(' · ');

  const header = `*${title}*\n${meta}\n${'-'.repeat(24)}`;

  const body = questions
    .map((q, i) => {
      const opts2 = q.options.map((o, j) => `   ${String.fromCharCode(65 + j)}) ${o}`).join('\n');
      return `\n*Q${i + 1}.* ${q.question}\n${opts2}`;
    })
    .join('\n');

  const key = includeAnswerKey
    ? `\n\n${'-'.repeat(24)}\n*Answer key:* ${questions
        .map((q, i) => `${i + 1}-${String.fromCharCode(65 + q.answer)}`)
        .join(', ')}`
    : '';

  const footer = `\n\n_Solve it, snap it, send it back to your mentor._\nPeerless Academy · Indranagar, Agartala`;

  return header + body + key + footer;
}

export function shareOnWhatsApp(messageText: string, phone?: string) {
  const base = phone
    ? `https://api.whatsapp.com/send?phone=${phone.replace(/\D/g, '')}&text=`
    : 'https://api.whatsapp.com/send?text=';
  window.open(base + encodeURIComponent(messageText), '_blank');
}

export function shareDppOnWhatsApp(opts: Parameters<typeof buildDppMessage>[0] & { phone?: string }) {
  shareOnWhatsApp(buildDppMessage(opts), opts.phone);
}
