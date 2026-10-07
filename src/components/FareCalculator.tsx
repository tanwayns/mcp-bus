import React, { useState } from 'react';
import { BusStop } from '../types/transit';
import { DollarSign, ArrowRight, ShieldCheck, Zap, Leaf, CheckCircle2 } from 'lucide-react';
import { playButtonTick } from '../utils/audioChime';

interface FareCalculatorProps {
  stops: BusStop[];
  soundEnabled: boolean;
  onSelectStop: (code: string) => void;
}

export const FareCalculator: React.FC<FareCalculatorProps> = ({
  stops,
  soundEnabled,
  onSelectStop,
}) => {
  const [originCode, setOriginCode] = useState<string>('03211'); // Dhoby Ghaut
  const [destCode, setDestCode] = useState<string>('84009'); // Bedok Int

  const originStop = stops.find((s) => s.code === originCode) || stops[0];
  const destStop = stops.find((s) => s.code === destCode) || stops[1];

  // Calculate distance estimate based on stop code hash difference
  const calculateDistance = () => {
    if (originCode === destCode) return 0.5;
    const diff = Math.abs(parseInt(originCode) - parseInt(destCode));
    const dist = ((diff % 25) + 3.4);
    return Math.min(32.5, Math.max(1.8, dist));
  };

  const distanceKm = calculateDistance();

  // LTA Distance-based adult fare scale (Card vs Cash)
  const calculateAdultCardFare = (dist: number) => {
    if (dist <= 3.2) return 1.09;
    if (dist <= 6.2) return 1.28;
    if (dist <= 10.2) return 1.54;
    if (dist <= 15.2) return 1.81;
    if (dist <= 20.2) return 2.05;
    if (dist <= 26.2) return 2.22;
    return 2.37;
  };

  const adultCardFare = calculateAdultCardFare(distanceKm);
  const adultCashFare = (adultCardFare + 0.85).toFixed(2);
  const studentFare = (adultCardFare * 0.38).toFixed(2);
  const seniorFare = (adultCardFare * 0.45).toFixed(2);
  const estimatedMins = Math.round(distanceKm * 2.2 + 6);
  const carbonSavedKg = (distanceKm * 0.16).toFixed(2);

  // Common direct services between these stops
  const commonServices = originStop.services.filter((s) => destStop.services.includes(s));

  return (
    <div className="bg-white border border-[#D9DDE8] rounded-[6px] p-4 sm:p-6 shadow-xs">
      <div className="pb-4 border-b border-[#ECEEF5]">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#E9EDFF] text-[#1E2B7B] rounded-[4px]">
            <DollarSign className="w-5 h-5 text-[#1E2B7B]" />
          </div>
          <div>
            <h2 className="font-geist font-extrabold text-xl text-[#141B2B]">
              LTA Distance-Based Fare & Transit Planner
            </h2>
            <p className="text-xs text-slate-500 font-inter">
              Official Public Transport Council (PTC) Fare Scale · Adult, Concession & Distance Matrix
            </p>
          </div>
        </div>
      </div>

      {/* Origin & Destination Selectors */}
      <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Origin */}
        <div className="bg-[#F9FAFC] border border-[#D9DDE8] p-4 rounded-[6px]">
          <label className="text-[11px] font-mono font-bold text-[#1E2B7B] block mb-1 uppercase">
            Boarding Bus Stop (Origin)
          </label>
          <select
            value={originCode}
            onChange={(e) => {
              if (soundEnabled) playButtonTick();
              setOriginCode(e.target.value);
            }}
            className="w-full bg-white text-sm font-geist font-bold text-[#141B2B] p-2.5 rounded-[4px] border border-[#D9DDE8] outline-none cursor-pointer"
          >
            {stops.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code} - {s.name} ({s.road})
              </option>
            ))}
          </select>
          <div className="mt-2 text-xs text-slate-500 font-inter">
            Services: <span className="font-mono font-bold text-slate-700">{originStop.services.join(', ')}</span>
          </div>
        </div>

        {/* Destination */}
        <div className="bg-[#F9FAFC] border border-[#D9DDE8] p-4 rounded-[6px]">
          <label className="text-[11px] font-mono font-bold text-[#D0102B] block mb-1 uppercase">
            Alighting Bus Stop (Destination)
          </label>
          <select
            value={destCode}
            onChange={(e) => {
              if (soundEnabled) playButtonTick();
              setDestCode(e.target.value);
            }}
            className="w-full bg-white text-sm font-geist font-bold text-[#141B2B] p-2.5 rounded-[4px] border border-[#D9DDE8] outline-none cursor-pointer"
          >
            {stops.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code} - {s.name} ({s.road})
              </option>
            ))}
          </select>
          <div className="mt-2 text-xs text-slate-500 font-inter">
            Services: <span className="font-mono font-bold text-slate-700">{destStop.services.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4">
        {/* Adult Card Fare */}
        <div className="p-4 bg-[#F1F3FF] border border-[#9CA8FF]/40 rounded-[6px]">
          <span className="text-[10px] font-mono font-bold text-[#1E2B7B] uppercase block">
            SimplyGo / EZ-Link
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-geist font-black text-2xl text-[#1E2B7B] tnum">
              ${adultCardFare.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-mono">Adult</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
            ✓ Transfer Rebate Valid
          </span>
        </div>

        {/* Student Concession */}
        <div className="p-4 bg-[#F4F5F9] border border-[#D9DDE8] rounded-[6px]">
          <span className="text-[10px] font-mono font-bold text-slate-600 uppercase block">
            Student Concession
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-geist font-black text-2xl text-slate-800 tnum">
              ${studentFare}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Primary / Sec / Poly
          </span>
        </div>

        {/* Senior / Concession */}
        <div className="p-4 bg-[#F4F5F9] border border-[#D9DDE8] rounded-[6px]">
          <span className="text-[10px] font-mono font-bold text-slate-600 uppercase block">
            Senior Citizen (60+)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-geist font-black text-2xl text-slate-800 tnum">
              ${seniorFare}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Silver Concession
          </span>
        </div>

        {/* Cash Fare */}
        <div className="p-4 bg-[#FFF5F6] border border-[#FFE2E0] rounded-[6px]">
          <span className="text-[10px] font-mono font-bold text-[#D0102B] uppercase block">
            Cash / Single Trip
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-geist font-black text-2xl text-[#D0102B] tnum">
              ${adultCashFare}
            </span>
          </div>
          <span className="text-[10px] text-red-600 font-semibold block mt-1">
            No transfer rebate
          </span>
        </div>
      </div>

      {/* Transit Metrics & Direct Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4 text-xs font-inter">
        <div className="p-3 bg-[#F9FAFC] border border-[#D9DDE8] rounded flex items-center gap-2.5">
          <Zap className="w-4 h-4 text-[#1E2B7B]" />
          <div>
            <span className="text-slate-500 block text-[10px] font-mono uppercase">Calculated Journey</span>
            <span className="font-geist font-bold text-sm text-[#141B2B]">
              {distanceKm.toFixed(1)} km · ~{estimatedMins} mins
            </span>
          </div>
        </div>

        <div className="p-3 bg-[#F9FAFC] border border-[#D9DDE8] rounded flex items-center gap-2.5">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <div>
            <span className="text-slate-500 block text-[10px] font-mono uppercase">Civic Sustainability</span>
            <span className="font-geist font-bold text-sm text-emerald-700">
              {carbonSavedKg} kg CO₂ saved vs car
            </span>
          </div>
        </div>

        <div className="p-3 bg-[#F9FAFC] border border-[#D9DDE8] rounded flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <div>
            <span className="text-slate-500 block text-[10px] font-mono uppercase">Fare Safeguard</span>
            <span className="font-geist font-bold text-sm text-[#141B2B]">
              Max 5 transfers / 2 hrs
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Direct Services */}
      <div className="mt-5 pt-4 border-t border-[#ECEEF5]">
        <h3 className="font-geist font-bold text-sm text-[#141B2B] mb-2 uppercase tracking-wide">
          Direct Corridor Services Connecting These Stops
        </h3>
        {commonServices.length > 0 ? (
          <div className="flex items-center gap-2 flex-wrap">
            {commonServices.map((svc) => (
              <button
                key={svc}
                onClick={() => {
                  if (soundEnabled) playButtonTick();
                  onSelectStop(originCode);
                }}
                className="bg-[#D0102B] hover:bg-[#B50B22] text-white px-3 py-1.5 rounded-[4px] font-geist font-bold text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Direct Bus {svc}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-white/80" />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-500 bg-[#F4F5F9] p-3 rounded">
            No single direct bus connects these two stops directly. Recommended route: Board Bus{' '}
            <strong className="text-[#1E2B7B]">{originStop.services[0]}</strong>, transfer at an intermodal MRT interchange (e.g. Dhoby Ghaut / Orchard) to complete the journey. Transfer fare rules apply continuously.
          </div>
        )}
      </div>
    </div>
  );
};
