import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="sticky top-0 z-50 flex items-center gap-4 border-b border-white/5 bg-slate-950/80 p-4 backdrop-blur-md lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center justify-center rounded-full bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <FileText className="text-coral" size={24} />
          <h1 className="text-lg font-bold text-white">Terms of Service</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-6 py-12 lg:p-12 lg:py-16">
        <div className="prose prose-invert max-w-none">
          <p className="text-sm font-bold uppercase tracking-wider text-coral">Last Updated: August 2026</p>
          <h1 className="mb-8 mt-2 text-4xl font-black text-white">Terms of Service</h1>

          <p>
            These Terms of Service ("Terms") govern your access to and use of the Peerless Academy web application, platform, and related services. By accessing or using our platform, you agree to be bound by these Terms.
          </p>

          <h2 className="mt-8 text-xl font-bold text-white">1. Account Registration</h2>
          <p>
            To access certain features of the platform (like the CBT Simulator, Monk Mode, and 3D Labs), you must register for an account. You may register using an email and password, or via a third-party service like Google. You are responsible for safeguarding your password and for all activities that occur under your account.
          </p>

          <h2 className="mt-8 text-xl font-bold text-white">2. Use of Services</h2>
          <p>
            Peerless Academy grants you a personal, non-exclusive, non-transferable, and revocable license to use our platform for your personal, non-commercial educational purposes. You agree not to:
          </p>
          <ul className="ml-6 list-disc space-y-2 marker:text-coral">
            <li>Copy, distribute, or disclose any part of the platform in any medium.</li>
            <li>Use automated systems (like bots or spiders) to access the platform.</li>
            <li>Attempt to interfere with or compromise our system integrity or security.</li>
            <li>Share accounts or attempt to bypass any feature gating or access controls.</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold text-white">3. Intellectual Property</h2>
          <p>
            All content on the platform, including video lectures, mock tests, 3D simulations, and AI features, is the intellectual property of Peerless Academy or its licensors. These materials are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, modify, or distribute our content without our express written permission.
          </p>

          <h2 className="mt-8 text-xl font-bold text-white">4. Third-Party Services</h2>
          <p>
            Our platform integrates with third-party services, including Google (for authentication) and Meta (for WhatsApp notifications). Your use of these third-party services is governed by their respective terms of service and privacy policies. Peerless Academy is not responsible for the content or practices of any third-party services.
          </p>

          <h2 className="mt-8 text-xl font-bold text-white">5. Termination</h2>
          <p>
            We may terminate or suspend your access to the platform immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.
          </p>

          <h2 className="mt-8 text-xl font-bold text-white">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Peerless Academy and its affiliates, instructors, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
          </p>

          <h2 className="mt-8 text-xl font-bold text-white">7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the platform after any such changes constitutes your acceptance of the new Terms.
          </p>
        </div>
      </main>
    </div>
  );
}
