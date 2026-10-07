import React, { useState, useEffect } from 'react';
import { RefreshCw, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { playButtonTick } from '../utils/audioChime';

interface HeaderProps {
  activeTab: 'arrivals' | 'tracker' | 'map' | 'fares' | 'advisories';
  setActiveTab: (tab: 'arrivals' | 'tracker' | 'map' | 'fares' | 'advisories') => void;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  refreshSeconds: number;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  advisoryCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  refreshSeconds,
  onManualRefresh,
  isRefreshing,
  advisoryCount,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-SG', {
          timeZone: 'Asia/Singapore',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tab: 'arrivals' | 'tracker' | 'map' | 'fares' | 'advisories') => {
    if (soundEnabled) playButtonTick();
    setActiveTab(tab);
  };

  return (
    <header className="bg-white border-b border-[#D9DDE8] sticky top-0 z-40 shadow-[0_2px_4px_rgba(17,24,39,0.04)]">
      {/* Top Civic Utility Ribbon */}
      <div className="bg-[#1E2B7B] text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#141b2b]/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse"></span>
            <span className="text-[#9CA8FF] font-mono font-semibold">LTA DATAMALL v2</span>
            <span className="text-white/60">·</span>
            <span className="text-white/90">TELEMETRY STREAM ACTIVE</span>
          </div>
          <span className="hidden sm:inline text-white/40">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-white/80">
            <ShieldCheck className="w-3.5 h-3.5 text-[#89F5E7]" />
            <span className="text-[11px] font-mono">STANDARDS COMPLIANT ISO 24014</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono ml-auto">
          <div className="flex items-center gap-1.5 bg-[#141B2B]/60 px-2.5 py-0.5 rounded border border-white/10">
            <span className="text-[#89F5E7] font-bold">SGT</span>
            <span className="text-white font-bold tracking-wider tnum">
              {timeStr || '21:38:40'}
            </span>
          </div>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playButtonTick();
            }}
            title={soundEnabled ? 'Mute commuter audio chimes' : 'Enable commuter audio chimes'}
            className="flex items-center gap-1 text-white/80 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#89F5E7]" />
                <span className="text-[11px] uppercase tracking-wider hidden md:inline">Chime On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-white/60" />
                <span className="text-[11px] uppercase tracking-wider hidden md:inline">Muted</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Brand & Authority Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Official SBS Transit Crimson Shield Badge */}
          <div className="flex items-center bg-[#D0102B] text-white px-3 py-1.5 rounded-[4px] shadow-sm font-geist font-black text-lg tracking-tight">
            <span>SBS</span>
            <span className="ml-1 text-[11px] uppercase tracking-wider font-semibold opacity-90 border-l border-white/30 pl-1.5">
              TRANSIT
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="font-geist text-xl font-extrabold text-[#141B2B] tracking-tight">
                Civic Velocity
              </h1>
              <span className="hidden md:inline font-mono text-[10px] uppercase font-bold tracking-widest text-[#D0102B] bg-[#FFE2E0] px-1.5 py-0.5 rounded">
                LIVE METRICS
              </span>
            </div>
            <p className="text-xs text-[#5C3F3E] hidden sm:block">
              Singapore Real-Time Passenger Bus Telemetry & Load Intelligence
            </p>
          </div>
        </div>

        {/* Real-time Refresh Action & Cadence */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex flex-col items-end text-right">
            <span className="text-[11px] text-slate-500 font-mono">
              Auto-sync in <span className="text-[#1E2B7B] font-bold font-mono">{refreshSeconds}s</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">GPS Telemetry Synced</span>
          </div>

          <button
            onClick={onManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-[#F4F5F9] hover:bg-[#E9EDFF] active:bg-[#DCE2F7] text-[#1E2B7B] border border-[#D9DDE8] hover:border-[#1E2B7B]/40 px-3 py-2 rounded text-xs font-semibold font-geist transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#D0102B]' : ''}`} />
            <span>{isRefreshing ? 'Refreshing…' : 'Refresh Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* Segmented Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1 border-t border-[#ECEEF5] pt-1">
          <button
            onClick={() => handleTabChange('arrivals')}
            className={`px-3.5 py-2.5 text-xs font-bold font-geist tracking-wide whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              activeTab === 'arrivals'
                ? 'border-[#D0102B] text-[#D0102B] bg-[#FFF5F6]'
                : 'border-transparent text-slate-600 hover:text-[#1E2B7B] hover:border-slate-300'
            }`}
          >
            Stop Arrivals
          </button>

          <button
            onClick={() => handleTabChange('tracker')}
            className={`px-3.5 py-2.5 text-xs font-bold font-geist tracking-wide whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              activeTab === 'tracker'
                ? 'border-[#D0102B] text-[#D0102B] bg-[#FFF5F6]'
                : 'border-transparent text-slate-600 hover:text-[#1E2B7B] hover:border-slate-300'
            }`}
          >
            Live Route Timeline
          </button>

          <button
            onClick={() => handleTabChange('map')}
            className={`px-3.5 py-2.5 text-xs font-bold font-geist tracking-wide whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              activeTab === 'map'
                ? 'border-[#D0102B] text-[#D0102B] bg-[#FFF5F6]'
                : 'border-transparent text-slate-600 hover:text-[#1E2B7B] hover:border-slate-300'
            }`}
          >
            Corridor Map
          </button>

          <button
            onClick={() => handleTabChange('fares')}
            className={`px-3.5 py-2.5 text-xs font-bold font-geist tracking-wide whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              activeTab === 'fares'
                ? 'border-[#D0102B] text-[#D0102B] bg-[#FFF5F6]'
                : 'border-transparent text-slate-600 hover:text-[#1E2B7B] hover:border-slate-300'
            }`}
          >
            Fare & Journey Planner
          </button>

          <button
            onClick={() => handleTabChange('advisories')}
            className={`px-3.5 py-2.5 text-xs font-bold font-geist tracking-wide whitespace-nowrap transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'advisories'
                ? 'border-[#D0102B] text-[#D0102B] bg-[#FFF5F6]'
                : 'border-transparent text-slate-600 hover:text-[#1E2B7B] hover:border-slate-300'
            }`}
          >
            <span>Civic Advisories</span>
            {advisoryCount > 0 && (
              <span className="bg-[#D0102B] text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                {advisoryCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
