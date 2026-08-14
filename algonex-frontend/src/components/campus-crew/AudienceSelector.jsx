import React from 'react';
import { User, Building2, Briefcase } from 'lucide-react';

const AudienceSelector = ({ activeAudience, onChangeAudience }) => {
  const audiences = [
    {
      id: 'student',
      label: "I'M A STUDENT",
      sub: 'Join the Cohort & Build',
      icon: User,
    },
    {
      id: 'college',
      label: "I'M A COLLEGE OFFICIAL",
      sub: 'Bring Algonex to Campus',
      icon: Building2,
    },
    {
      id: 'industry',
      label: "I'M AN INDUSTRY PARTNER",
      sub: 'Mentor & Access Talent',
      icon: Briefcase,
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-3">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-500">
          SELECT YOUR PERSPECTIVE TO CUSTOMIZE THE EXPERIENCE
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {audiences.map((aud) => {
          const Icon = aud.icon;
          const isActive = activeAudience === aud.id;

          return (
            <button
              key={aud.id}
              onClick={() => onChangeAudience(aud.id)}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl transition-all duration-300 text-left border ${
                isActive
                  ? 'bg-white border-[#00B4D8] shadow-lg shadow-cyan-500/10 scale-105'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <div className={`p-3 rounded-xl mb-2.5 ${isActive ? 'bg-[#00B4D8] text-white' : 'bg-slate-200 text-slate-600'}`}>
                <Icon size={22} />
              </div>
              <span className={`font-inter font-bold text-sm tracking-wide ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                {aud.label}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                {aud.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AudienceSelector;
