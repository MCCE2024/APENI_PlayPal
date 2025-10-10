
import React from 'react';

interface LandingPageProps {
  onLogin: () => void;
}

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-500/10 text-emerald-400 mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-slate-400">{description}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative pt-24 pb-32 text-center">
        <div className="absolute inset-0 bg-grid-slate-700/[0.05] [mask-image:linear-gradient(to_bottom,white_5%,transparent_100%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Find Your Perfect Match. <span className="text-emerald-400">Anytime.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400">
            PlayPal is the effortless way to connect with sports enthusiasts at your skill level, on your schedule. Stop searching, start playing.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={onLogin}
              className="px-8 py-3 text-lg font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-transform duration-200 hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Why PlayPal?</h2>
                <p className="mt-4 text-lg text-slate-400">Everything you need for your next game.</p>
            </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
                title="Skill-Based Matching"
                description="Our system connects you with players of a similar skill level, ensuring competitive and enjoyable games."
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
            />
            <FeatureCard 
                title="Flexible Scheduling"
                description="Set your availability and let us find opponents who can play when you can. No more back-and-forth messages."
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            />
            <FeatureCard 
                title="Discover New Players"
                description="Expand your circle and challenge new opponents. Find players for your favorite sports in your local area."
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
          </div>
        </div>
      </div>

       {/* Footer */}
       <footer className="bg-slate-900 border-t border-slate-800">
         <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-slate-500">
            <p>&copy; {new Date().getFullYear()} PlayPal. All rights reserved.</p>
         </div>
       </footer>
    </>
  );
};

export default LandingPage;
