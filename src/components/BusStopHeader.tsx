import React from 'react';
import { BusStop, MRTTransfer } from '../types/transit';
import { MapPin, Navigation, Share2, Check } from 'lucide-react';
import { playButtonTick } from '../utils/audioChime';

interface BusStopHeaderProps {
  currentStop: BusStop;
  allStops: BusStop[];
  onSelectStop: (stopCode: string) => void;
  soundEnabled: boolean;
}

// MRT line color helper
export const getMRTLineColor = (line: MRTTransfer['line']) => {
  switch (line) {
    case 'NSL':
      return { bg: 'bg-[#D42E12]', text: 'text-white', border: 'border-[#B3220B]' };
    case 'EWL':
      return { bg: 'bg-[#009640]', text: 'text-white', border: 'border-[#007A33]' };
    case 'NEL':
      return { bg: 'bg-[#8F1A95]', text: 'text-white', border: 'border-[#75157A]' };
    case 'CCL':
      return { bg: 'bg-[#FA9E0D]', text: 'text-white', border: 'border-[#D98505]' };
    case 'DTL':
      return { bg: 'bg-[#005EC4]', text: 'text-white', border: 'border-[#004A9C]' };
    case 'TEL':
      return { bg: 'bg-[#9D5B25]', text: 'text-white', border: 'border-[#7E491E]' };
    default:
      return { bg: 'bg-[#748577]', text: 'text-white', border: 'border-[#5C6A5E]' };
  }
};

export const BusStopHeader: React.FC<BusStopHeaderProps> = ({
  currentStop,
  allStops,
  onSelectStop,
  soundEnabled,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (soundEnabled) playButtonTick();
    navigator.clipboard?.writeText?.(currentStop.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-[#D9DDE8] rounded-[6px] p-4 sm:p-5 shadow-xs mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Code Badge + Titles */}
        <div className="flex items-start gap-3.5">
          {/* 5-Digit Bus Stop Code Badge matching specification */}
          <div className="flex flex-col items-center justify-center bg-[#1E2B7B] text-white px-3 py-2 rounded-[4px] min-w-[90px] shadow-xs">
            <span className="text-[10px] font-mono tracking-widest text-[#9CA8FF] uppercase">
              B/S CODE
            </span>
            <span className="font-geist font-black text-xl tracking-wider tnum">
              {currentStop.code}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-geist font-extrabold text-xl sm:text-2xl text-[#141B2B] tracking-tight">
                {currentStop.name}
              </h2>
              {currentStop.distanceMeters && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#0D9488] bg-[#E6F8F6] px-2 py-0.5 rounded">
                  <Navigation className="w-3 h-3 text-[#0D9488]" />
                  {currentStop.distanceMeters}m away
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#5C3F3E] font-inter mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentStop.road}</span>
            </p>

            {/* Intermodal MRT Transfer Pellets */}
            {currentStop.transfers && currentStop.transfers.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                  MRT Transfers:
                </span>
                {currentStop.transfers.map((tr) => {
                  const colors = getMRTLineColor(tr.line);
                  return (
                    <span
                      key={tr.code}
                      title={`Intermodal transfer to ${tr.stationName} MRT (${tr.line})`}
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] text-[11px] font-mono font-bold ${colors.bg} ${colors.text} shadow-xs`}
                    >
                      <span>{tr.code}</span>
                      <span className="opacity-80 text-[10px] hidden sm:inline">{tr.stationName}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action & Other Stop Switcher */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          {/* Quick Stop Switcher */}
          <div className="flex items-center gap-1.5 bg-[#ECEEF5] p-1 rounded-[4px]">
            <span className="text-[11px] font-mono font-bold text-slate-600 px-1.5 uppercase">
              Switch:
            </span>
            <select
              value={currentStop.code}
              onChange={(e) => {
                if (soundEnabled) playButtonTick();
                onSelectStop(e.target.value);
              }}
              className="bg-white text-xs font-semibold font-geist text-[#141B2B] px-2.5 py-1.5 rounded-[3px] border border-[#D9DDE8] outline-none focus:ring-1 focus:ring-[#1E2B7B] cursor-pointer"
            >
              {allStops.map((stop) => (
                <option key={stop.code} value={stop.code}>
                  {stop.code} - {stop.name} ({stop.road})
                </option>
              ))}
            </select>
          </div>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            title="Copy Bus Stop Code"
            className="flex items-center gap-1 text-xs font-mono font-semibold text-slate-600 hover:text-[#1E2B7B] bg-[#ECEEF5] hover:bg-[#E1E8FD] px-2.5 py-2 rounded-[4px] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
