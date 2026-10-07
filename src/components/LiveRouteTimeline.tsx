import React, { useState } from 'react';
import { BusRouteDetail } from '../types/transit';
import { getMRTLineColor } from './BusStopHeader';
import { Bus, Clock, Bell, BellRing, Gauge, ChevronRight } from 'lucide-react';
import { playButtonTick, playTransitArrivalChime } from '../utils/audioChime';

interface LiveRouteTimelineProps {
  routeDetail: BusRouteDetail;
  availableServices: string[];
  selectedServiceNo: string;
  onSelectService: (serviceNo: string) => void;
  onJumpToStop: (stopCode: string) => void;
  soundEnabled: boolean;
}

export const LiveRouteTimeline: React.FC<LiveRouteTimelineProps> = ({
  routeDetail,
  availableServices,
  selectedServiceNo,
  onSelectService,
  onJumpToStop,
  soundEnabled,
}) => {
  const [alarmActiveStop, setAlarmActiveStop] = useState<string | null>(null);
  const [direction, setDirection] = useState<'forward' | 'reverse'>('forward');

  const stops = direction === 'forward' ? routeDetail.stops : [...routeDetail.stops].reverse();
  const currentOrigin = direction === 'forward' ? routeDetail.origin : routeDetail.destination;
  const currentDestination = direction === 'forward' ? routeDetail.destination : routeDetail.origin;

  const handleToggleAlarm = (stopCode: string) => {
    if (soundEnabled) playButtonTick();
    if (alarmActiveStop === stopCode) {
      setAlarmActiveStop(null);
    } else {
      setAlarmActiveStop(stopCode);
      if (soundEnabled) {
        setTimeout(() => {
          playTransitArrivalChime();
        }, 1500);
      }
    }
  };

  return (
    <div className="bg-white border border-[#D9DDE8] rounded-[6px] p-4 sm:p-6 shadow-xs">
      {/* Route Header & Service Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#ECEEF5]">
        <div className="flex items-center gap-3.5">
          {/* Large Crimson Service Badge */}
          <div className="bg-[#D0102B] text-white px-3.5 py-2.5 rounded-[4px] shadow-sm flex flex-col items-center justify-center min-w-[76px]">
            <span className="font-geist font-black text-3xl leading-none tracking-tight">
              {routeDetail.serviceNo}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-85 mt-0.5">
              {routeDetail.category}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                Corridor:
              </span>
              <h2 className="font-geist font-extrabold text-xl sm:text-2xl text-[#141B2B] tracking-tight">
                {currentOrigin} <span className="text-[#D0102B]">→</span> {currentDestination}
              </h2>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap font-inter">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{routeDetail.operatingHours}</span>
              </span>
              <span>·</span>
              <span className="font-mono text-slate-700">Peak: {routeDetail.frequencyPeak}</span>
              <span>·</span>
              <span className="font-mono text-slate-500">Off-Peak: {routeDetail.frequencyOffPeak}</span>
            </div>
          </div>
        </div>

        {/* Direction Switcher & Service Chooser */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Route Selector */}
          <div className="flex items-center gap-1.5 bg-[#ECEEF5] p-1 rounded-[4px]">
            <span className="text-[11px] font-mono font-bold text-slate-600 px-1.5 uppercase">
              Route:
            </span>
            <select
              value={selectedServiceNo}
              onChange={(e) => {
                if (soundEnabled) playButtonTick();
                onSelectService(e.target.value);
              }}
              className="bg-white text-xs font-bold font-geist text-[#141B2B] px-2.5 py-1.5 rounded-[3px] border border-[#D9DDE8] outline-none focus:ring-1 focus:ring-[#1E2B7B] cursor-pointer"
            >
              {availableServices.map((svc) => (
                <option key={svc} value={svc}>
                  Service {svc}
                </option>
              ))}
            </select>
          </div>

          {/* Direction Toggle */}
          <button
            onClick={() => {
              if (soundEnabled) playButtonTick();
              setDirection(direction === 'forward' ? 'reverse' : 'forward');
            }}
            className="flex items-center gap-1.5 bg-[#1E2B7B] hover:bg-[#152063] text-white px-3 py-2 rounded-[4px] text-xs font-semibold font-geist transition-colors cursor-pointer shadow-xs"
          >
            <span>Switch Direction</span>
          </button>
        </div>
      </div>

      {/* Live Route Telemetry Legend */}
      <div className="py-3 px-3.5 bg-[#F9FAFC] border-b border-[#ECEEF5] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D0102B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D0102B]"></span>
            </span>
            <span className="font-mono font-bold text-[#D0102B]">Live Bus Beacon (In Transit)</span>
          </div>
          <span>·</span>
          <span className="text-[11px] font-mono text-slate-500">
            {stops.filter(s => s.hasActiveBus).length} Active Buses Monitored
          </span>
        </div>

        <div className="text-[11px] font-inter text-slate-500">
          Click stop name to open Live Departure Board
        </div>
      </div>

      {/* The 2px Spine Vertical Timeline */}
      <div className="relative pt-6 pb-2 pl-4 sm:pl-8">
        {/* Continuous 2px vertical spine */}
        <div className="absolute left-[23px] sm:left-[39px] top-6 bottom-6 w-[2px] bg-[#D9DDE8]" />

        <div className="space-y-6">
          {stops.map((stop, idx) => {
            const hasBus = stop.hasActiveBus;
            const isAlarmSet = alarmActiveStop === stop.stopCode;

            return (
              <div key={stop.stopCode} className="relative flex items-start gap-4 sm:gap-6 group">
                
                {/* Timeline Node Marker */}
                <div className="relative z-10 flex-shrink-0">
                  {hasBus ? (
                    /* Active Animated Bus Pulse Beacon */
                    <div className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-[#D0102B] text-white rounded-full shadow-md">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D0102B] opacity-60"></span>
                      <Bus className="w-3.5 h-3.5 relative z-10" />
                    </div>
                  ) : (
                    /* Normal or Interchange Stop Node */
                    <div
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 transition-all mt-1 ${
                        stop.isInterchange
                          ? 'bg-[#1E2B7B] border-white ring-2 ring-[#1E2B7B]'
                          : 'bg-white border-[#916F6D] group-hover:border-[#1E2B7B]'
                      }`}
                    />
                  )}
                </div>

                {/* Stop Card Details */}
                <div className="flex-1 bg-[#F9FAFC] group-hover:bg-[#F1F3FF] border border-[#E2E6F0] group-hover:border-[#C4C9D8] rounded-[6px] p-3 sm:p-4 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* 5-Digit Stop Code Badge */}
                        <span className="px-1.5 py-0.5 bg-[#1E2B7B] text-white rounded-[2px] font-mono font-bold text-[11px] tracking-wider">
                          {stop.stopCode}
                        </span>

                        {/* Stop Name (Clickable) */}
                        <button
                          onClick={() => {
                            if (soundEnabled) playButtonTick();
                            onJumpToStop(stop.stopCode);
                          }}
                          className="font-geist font-bold text-sm sm:text-base text-[#141B2B] hover:text-[#D0102B] transition-colors text-left flex items-center gap-1 cursor-pointer"
                        >
                          <span>{stop.stopName}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                        </button>

                        {stop.isInterchange && (
                          <span className="px-1.5 py-0.5 bg-[#E1E8FD] text-[#1E2B7B] rounded text-[10px] font-mono font-bold uppercase">
                            Interchange
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 font-inter mt-0.5">
                        {stop.roadName} · <span className="font-mono text-slate-600">{stop.distanceKm.toFixed(1)} km</span> from origin
                      </div>

                      {/* MRT Transfer Badges */}
                      {stop.transfers && stop.transfers.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {stop.transfers.map((tr) => {
                            const colors = getMRTLineColor(tr.line);
                            return (
                              <span
                                key={tr.code}
                                className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${colors.bg} ${colors.text}`}
                              >
                                {tr.code} {tr.stationName}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Right Action: Telemetry or Commuter Alarm */}
                    <div className="flex items-center gap-2 self-start sm:self-center pt-2 sm:pt-0">
                      {hasBus && (
                        <div className="bg-[#FFE2E0] border border-[#D0102B]/30 px-2.5 py-1.5 rounded-[4px] text-right">
                          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#D0102B]">
                            <Gauge className="w-3 h-3" />
                            <span>{stop.activeBusPlate}</span>
                            <span>·</span>
                            <span>{stop.activeBusSpeed} km/h</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-700 block">
                            Load: {stop.activeBusLoad === 'SEA' ? 'Seats Avail' : 'Standing Avail'}
                          </span>
                        </div>
                      )}

                      {/* Commuter Reminder Alarm */}
                      <button
                        onClick={() => handleToggleAlarm(stop.stopCode)}
                        title={
                          isAlarmSet
                            ? 'Cancel arrival alert for this stop'
                            : 'Set alarm: notify me when bus is 2 stops away'
                        }
                        className={`p-2 rounded-[4px] border text-xs font-semibold font-geist flex items-center gap-1.5 transition-all cursor-pointer ${
                          isAlarmSet
                            ? 'bg-[#D0102B] text-white border-[#D0102B] shadow-xs'
                            : 'bg-white text-slate-600 border-[#D9DDE8] hover:bg-[#F4F5F9]'
                        }`}
                      >
                        {isAlarmSet ? (
                          <>
                            <BellRing className="w-3.5 h-3.5 animate-bounce" />
                            <span className="text-[11px]">Alarm Set</span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[11px] hidden sm:inline">Alert Me</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
