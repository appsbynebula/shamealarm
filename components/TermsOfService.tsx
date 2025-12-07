
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-neutral-900 text-neutral-300 p-8 pt-20 overflow-y-auto animate-fade-in font-sans">
            <button
                onClick={() => navigate(-1)}
                className="mb-8 text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
            >
                ← Back
            </button>

            <div className="max-w-2xl mx-auto space-y-8 pb-20">
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">Terms of Service</h1>

                <section>
                    <h2 className="text-xl font-bold text-white mb-2">1. Acceptance</h2>
                    <p>By using Shame Alarm, you agree to these terms. If you do not agree, do not use the app.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-2">2. Public Shaming</h2>
                    <p className="font-bold text-red-400">WARNING:</p>
                    <p>If you connect your X (Twitter) account, you grant us permission to post on your behalf when you leave the app during a Focus session. You acknowledge this is the core feature of the app.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-2">3. Liability</h2>
                    <p>We are not responsible for any social or professional consequences resulting from the automated shame posts.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-2">4. Termination</h2>
                    <p>You may disconnect your account at any time via the User Profile or Twitter settings.</p>
                </section>

                <p className="text-xs text-neutral-600 mt-12 pt-8 border-t border-neutral-800">
                    Last updated: December 2025
                </p>
            </div>
        </div>
    );
};

export default TermsOfService;
