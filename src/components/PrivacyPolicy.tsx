import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
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
          <Shield className="text-coral" size={24} />
          <h1 className="text-lg font-bold text-white">Privacy Policy</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-6 py-12 lg:p-12 lg:py-16">
        <div className="prose prose-invert max-w-none">
          <p className="text-sm font-bold uppercase tracking-wider text-coral">Last Updated: August 2026</p>
          <h1 className="mb-8 mt-2 text-4xl font-black text-white">Privacy Policy</h1>

          <p>
            Welcome to Peerless Academy. Your privacy is critically important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our web application and use our services, including our Google Authentication integrations.
          </p>

          <h2 className="mt-8 text-xl font-bold text-white">1. Information We Collect</h2>
          <p>
            <strong>Personal Information:</strong> When you register for an account (including via Google Sign-In), we may collect personal information such as your name, email address, profile picture, phone number, and educational details (e.g., class level).<br/><br/>
            <strong>Usage Data:</strong> We automatically collect certain information when you visit, use, or navigate the application. This includes device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, and information about how and when you use our services (e.g., test scores, monk mode streaks, and CBT simulator progress).
          </p>

          <h2 className="mt-8 text-xl font-bold text-white">2. How We Use Your Information</h2>
          <p>We use the information we collect or receive to:</p>
          <ul className="ml-6 list-disc space-y-2 marker:text-coral">
            <li><strong>Facilitate Account Creation and Logon Process:</strong> If you choose to link your account with us to a third-party account (such as your Google account), we use the information you allowed us to collect from those third parties to facilitate account creation and logon processes.</li>
            <li><strong>Provide and Manage Services:</strong> To deliver personalized learning paths, maintain Elo rankings, and provide AI doubt-solving functionalities.</li>
            <li><strong>Communicate With You:</strong> To respond to your inquiries, send administrative information, and provide WhatsApp notifications via the official Meta Cloud API.</li>
            <li><strong>Improve Our Platform:</strong> To analyze usage data, troubleshoot issues, and enhance the educational features of Peerless Academy.</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold text-white">3. Information Sharing and Disclosure</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your personal information to third parties. We may share data with third-party vendors, service providers, contractors, or agents who perform services for us (such as Supabase for database hosting, or Meta for WhatsApp messaging).
          </p>

          <h2 className="mt-8 text-xl font-bold text-white">4. Google User Data</h2>
          <p>
            Our app uses Google OAuth for authentication. Our use and transfer of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-coral underline hover:text-amber-500">Google API Services User Data Policy</a>, including the Limited Use requirements. We only request the minimum scopes necessary (email and profile) to authenticate you and create your student profile.
          </p>

          <h2 className="mt-8 text-xl font-bold text-white">5. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information (including secure HTTPS protocols and row-level security in Supabase). However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
          </p>

          <h2 className="mt-8 text-xl font-bold text-white">6. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: <br/>
            <strong>Email:</strong> admin@peerlessacademy.com<br/>
            <strong>Phone:</strong> +91-7005639061
          </p>
        </div>
      </main>
    </div>
  );
}
