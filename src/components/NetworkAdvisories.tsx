import React from 'react';
import { NetworkAdvisory } from '../types/transit';
import { AlertTriangle, Info, Calendar, Clock, ArrowRight } from 'lucide-react';
import { playButtonTick } from '../utils/audioChime';

interface NetworkAdvisoriesProps {
  advisories: NetworkAdvisory[];
  soundEnabled: boolean;
  onSelectService: (serviceNo: string) => void;
}

export const NetworkAdvisories: React.FC<NetworkAdvisoriesProps> = ({
  advisories,
  soundEnabled,
  onSelectService,
}) => {
  return (
    <div className="bg-white border border-[#D9DDE8] rounded-[6px] p-4 sm:p-6 shadow-xs">
      <div className="pb-4 border-b border-[#ECEEF5]">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#FFE2E0] text-[#D0102B] rounded-[4px]">
            <AlertTriangle className="w-5 h-5 text-[#D0102B]" />
          </div>
          <div>
            <h2 className="font-geist font-extrabold text-xl text-[#141B2B]">
              Civic Operations & Service Advisories
            </h2>
            <p className="text-xs text-slate-500 font-inter">
              Official Land Transport Authority (LTA) & SBS Transit Public Bulletins
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {advisories.map((advisory) => {
          const isUrgent = advisory.severity === 'urgent';
          const isDiversion = advisory.category === 'Diversion';

          return (
            <div
              key={advisory.id}
              className={`p-4 sm:p-5 rounded-[6px] border transition-all ${
                isUrgent
                  ? 'bg-[#FFF5F6] border-[#D0102B]/40 shadow-xs'
                  : isDiversion
                  ? 'bg-[#FFFBEB] border-amber-300 shadow-xs'
                  : 'bg-[#F9FAFC] border-[#D9DDE8]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-black/5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isUrgent
                        ? 'bg-[#D0102B] text-white'
                        : isDiversion
                        ? 'bg-[#D97706] text-white'
                        : 'bg-[#1E2B7B] text-white'
                    }`}
                  >
                    {advisory.category}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    ID: {advisory.id}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Valid until: {advisory.validUntil}</span>
                  </span>
                </div>
              </div>

              <h3 className="font-geist font-bold text-base sm:text-lg text-[#141B2B] mt-2.5">
                {advisory.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-700 font-inter mt-1.5 leading-relaxed">
                {advisory.description}
              </p>

              {/* Affected Services */}
              <div className="mt-3.5 pt-3 border-t border-black/5 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-slate-600 uppercase">
                  Affected Services:
                </span>
                {advisory.affectedServices.map((svc) => (
                  <button
                    key={svc}
                    onClick={() => {
                      if (soundEnabled) playButtonTick();
                      onSelectService(svc);
                    }}
                    className="px-2 py-0.5 bg-white border border-slate-300 hover:border-[#D0102B] rounded text-xs font-mono font-bold text-[#141B2B] hover:text-[#D0102B] transition-colors cursor-pointer shadow-2xs"
                  >
                    Bus {svc}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
