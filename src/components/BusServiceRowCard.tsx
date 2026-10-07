import React from 'react';
import { BusArrivalSlot, BusServiceArrival, LoadStatus, VehicleType } from '../types/transit';
import { Bookmark, Accessibility, ChevronRight } from 'lucide-react';
import { playButtonTick } from '../utils/audioChime';

interface BusServiceRowCardProps {
  service: BusServiceArrival;
  currentStopCode: string;
  isBookmarked: boolean;
  onToggleBookmark: (serviceNo: string) => void;
  onSelectService: (serviceNo: string) => void;
  soundEnabled: boolean;
}

// Vehicle type glyphs
const VehicleGlyph: React.FC<{ type: VehicleType }> = ({ type }) => {
  if (type === 'DD') {
    return (
      <span
        title="Double Decker Bus (DD) · High Passenger Capacity"
        className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-slate-100 rounded text-[9px] font-mono font-bold text-slate-700 tracking-wider"
      >
        <span className="w-1.5 h-2.5 border border-slate-600 rounded-[1px] flex flex-col justify-between py-[1px]">
          <span className="h-[2px] bg-slate-600 block"></span>
          <span className="h-[2px] bg-slate-600 block"></span>
        </span>
        DD
      </span>
    );
  }
  return (
    <span
      title="Single Decker Bus (SD)"
      className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-slate-100 rounded text-[9px] font-mono font-bold text-slate-600 tracking-wider"
    >
      <span className="w-2.5 h-1.5 border border-slate-500 rounded-[1px] block"></span>
      SD
    </span>
  );
};

// Arrival chip for each chronological slot
const ArrivalChip: React.FC<{
  slot: BusArrivalSlot;
  label: 'Next' | '2nd' | '3rd';
  isFirst?: boolean;
}> = ({ slot, label, isFirst = false }) => {
  // LTA load indicator color mappings
  const loadColors: Record<LoadStatus, { border: string; bg: string; text: string; dot: string; title: string }> = {
    SEA: {
      border: 'border-[#15803D]',
      bg: 'bg-emerald-50/70',
      text: 'text-[#15803D]',
      dot: 'bg-[#15803D]',
      title: 'Seats Available (SEA)',
    },
    SDA: {
      border: 'border-[#D97706]',
      bg: 'bg-amber-50/70',
      text: 'text-[#D97706]',
      dot: 'bg-[#D97706]',
      title: 'Standing Available (SDA)',
    },
    LSD: {
      border: 'border-[#DC2626]',
      bg: 'bg-red-50/70',
      text: 'text-[#DC2626]',
      dot: 'bg-[#DC2626]',
      title: 'Limited Standing (LSD)',
    },
  };

  const style = loadColors[slot.load];

  const formatCountdown = (mins: number) => {
    if (mins <= 0) return 'Arr';
    if (mins === 1) return '1m';
    return `${mins}m`;
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-between p-2 rounded-[6px] border ${
        isFirst ? 'bg-white border-[#D9DDE8] shadow-xs ring-1 ring-slate-900/5' : 'bg-[#F9FAFC] border-[#E2E6F0]'
      } w-20 sm:w-22 min-h-[76px] transition-all hover:border-[#1E2B7B]/40 group`}
    >
      {/* Top Load Indicator Bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 rounded-t-[5px] ${
          slot.load === 'SEA' ? 'bg-[#15803D]' : slot.load === 'SDA' ? 'bg-[#D97706]' : 'bg-[#DC2626]'
        }`}
        title={style.title}
      />

      {/* Header with Slot Position & Arrival Clock */}
      <div className="w-full flex items-center justify-between pt-0.5 text-[9px] text-slate-500 font-mono">
        <span className="font-semibold">{label}</span>
        <span className="text-[10px] text-slate-600 tnum">{slot.etaTimestamp}</span>
      </div>

      {/* Main Countdown Value in label-countdown font */}
      <div className="my-0.5 flex items-baseline gap-0.5">
        <span
          className={`font-geist font-extrabold tracking-tight tnum ${
            slot.etaMinutes === 0
              ? 'text-lg text-[#D0102B] animate-pulse'
              : 'text-xl text-[#141B2B]'
          }`}
        >
          {formatCountdown(slot.etaMinutes)}
        </span>
      </div>

      {/* Bottom Glyphs (Vehicle Type & Wheelchair Accessibility & Load badge) */}
      <div className="w-full flex items-center justify-between border-t border-slate-200/60 pt-1">
        <div className="flex items-center gap-1">
          <VehicleGlyph type={slot.vehicleType} />
          {slot.wheelchairAccessible && (
            <span title="Wheelchair Accessible Bus (WAB)" className="inline-flex">
              <Accessibility
                className="w-2.5 h-2.5 text-blue-600"
                aria-label="Wheelchair Accessible Bus"
              />
            </span>
          )}
        </div>

        {/* Load Status Pill */}
        <span
          className={`w-2 h-2 rounded-full ${style.dot}`}
          title={`${style.title} (${slot.occupancyPercent}% capacity)`}
        />
      </div>
    </div>
  );
};

export const BusServiceRowCard: React.FC<BusServiceRowCardProps> = ({
  service,
  isBookmarked,
  onToggleBookmark,
  onSelectService,
  soundEnabled,
}) => {
  const isFeeder = service.category === 'Feeder';
  const isExpress = service.category === 'Express';

  return (
    <div className="bg-white border border-[#D9DDE8] rounded-[6px] hover:border-[#1E2B7B]/50 transition-all duration-200 shadow-xs hover:shadow-sm overflow-hidden group">
      <div className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        
        {/* Left & Center Information Segment */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
          {/* Service Badge (Crimson for Trunk/Express, Cobalt for Feeder) */}
          <button
            onClick={() => {
              if (soundEnabled) playButtonTick();
              onSelectService(service.serviceNo);
            }}
            title="Click to view live route corridor"
            className={`cursor-pointer min-w-[70px] sm:min-w-[80px] h-[52px] sm:h-[58px] rounded-[4px] flex flex-col items-center justify-center text-white px-2 shadow-xs transition-transform active:scale-95 ${
              isFeeder
                ? 'bg-[#1E2B7B] hover:bg-[#152063]'
                : isExpress
                ? 'bg-[#005B53] hover:bg-[#004741]'
                : 'bg-[#D0102B] hover:bg-[#B50B22]'
            }`}
          >
            <span className="font-geist font-black text-2xl sm:text-[28px] leading-none tracking-tight">
              {service.serviceNo}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest opacity-85 mt-0.5">
              {service.category}
            </span>
          </button>

          {/* Destination & Route Context */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 font-mono uppercase tracking-wider">
                To
              </span>
              <h3 className="font-geist font-bold text-base sm:text-lg text-[#141B2B] truncate tracking-tight">
                {service.destination}
              </h3>
            </div>

            <p className="text-xs text-slate-600 mt-0.5 truncate font-inter">
              {service.subtext}
            </p>

            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 font-inter">
              <span className="font-medium text-slate-700">{service.operator}</span>
              <span>·</span>
              <span className="text-slate-500 font-mono">From {service.origin}</span>
              <span>·</span>
              <button
                onClick={() => {
                  if (soundEnabled) playButtonTick();
                  onSelectService(service.serviceNo);
                }}
                className="text-[#1E2B7B] hover:text-[#D0102B] font-medium font-geist inline-flex items-center gap-0.5 cursor-pointer"
              >
                Inspect Route <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => {
              if (soundEnabled) playButtonTick();
              onToggleBookmark(service.serviceNo);
            }}
            title={isBookmarked ? 'Remove from saved services' : 'Bookmark bus service'}
            className={`p-2 rounded hover:bg-slate-100 transition-colors cursor-pointer self-start sm:self-center ${
              isBookmarked ? 'text-[#D0102B]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#D0102B]' : ''}`} />
          </button>
        </div>

        {/* Right Slot: The Arrival Triplet */}
        <div className="flex items-center justify-end gap-2 border-t md:border-t-0 md:border-l border-[#ECEEF5] pt-2.5 md:pt-0 md:pl-4 self-end md:self-center">
          <ArrivalChip slot={service.nextBus} label="Next" isFirst={true} />
          <ArrivalChip slot={service.secondBus} label="2nd" />
          <ArrivalChip slot={service.thirdBus} label="3rd" />
        </div>
      </div>
    </div>
  );
};
