
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
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
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">Privacy Policy</h1>

                <section>
                    <h2 className="text-xl font-bold text-white mb-2">1. Overview</h2>
                    <p>Shame Alarm ("we", "us") values your privacy. We collect minimal data necessary to shame you into productivity.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-2">2. Data We Collect</h2>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Account information (provided by Twitter/X).</li>
                        <li>Usage statistics (focus time, shames, streaks).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-2">3. How We Use Data</h2>
                    <p>We use your data to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Track your productivity.</li>
                        <li>Publicly shame you on X (Twitter) when you fail, ONLY if you connect your account.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-2">4. Third Parties</h2>
                    <p>We use Supabase for authentication and database services. We interact with the X (Twitter) API on your behalf.</p>
                </section>

                <p className="text-xs text-neutral-600 mt-12 pt-8 border-t border-neutral-800">
                    Last updated: December 2025
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
