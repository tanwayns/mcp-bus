import React, { useState, useEffect } from 'react';
import { BusRouteDetail } from '../types/transit';
import { Bus, MapPin, Gauge, ShieldAlert, Sparkles, Navigation } from 'lucide-react';
import { playButtonTick } from '../utils/audioChime';

interface RouteCorridorMapProps {
  routeDetail: BusRouteDetail;
  availableServices: string[];
  selectedServiceNo: string;
  onSelectService: (serviceNo: string) => void;
  onSelectStop: (stopCode: string) => void;
  soundEnabled: boolean;
}

export const RouteCorridorMap: React.FC<RouteCorridorMapProps> = ({
  routeDetail,
  availableServices,
  selectedServiceNo,
  onSelectService,
  onSelectStop,
  soundEnabled,
}) => {
  const [activeBusPos, setActiveBusPos] = useState<number>(35); // percentage along route
  const [selectedBusPlate, setSelectedBusPlate] = useState<string>('SBS 3288Y');

  // Simulate bus movement along the corridor
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBusPos((prev) => (prev >= 92 ? 10 : prev + 1.5));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const stops = routeDetail.stops;

  return (
    <div className="bg-white border border-[#D9DDE8] rounded-[6px] p-4 sm:p-6 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#ECEEF5]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#D0102B] text-white font-geist font-black text-lg px-2.5 py-0.5 rounded-[3px]">
              Service {routeDetail.serviceNo}
            </span>
            <h2 className="font-geist font-extrabold text-xl text-[#141B2B]">
              Corridor Telemetry & Spatial Schematic
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-inter mt-1">
            Singapore Land Transport Grid · Real-time satellite GPS tracking of active fleet
          </p>
        </div>

        {/* Route Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500">CORRIDOR:</span>
          <select
            value={selectedServiceNo}
            onChange={(e) => {
              if (soundEnabled) playButtonTick();
              onSelectService(e.target.value);
            }}
            className="bg-[#F4F5F9] text-xs font-bold font-geist text-[#141B2B] px-3 py-2 rounded-[4px] border border-[#D9DDE8] outline-none cursor-pointer"
          >
            {availableServices.map((svc) => (
              <option key={svc} value={svc}>
                Route {svc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Schematic Transit Board (SVG Canvas) */}
      <div className="my-5 bg-[#141B2B] rounded-[6px] p-4 sm:p-6 text-white relative overflow-hidden border border-slate-700 shadow-inner">
        {/* Subtle Map Grid Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#9ca8ff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Telemetry Overlay */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488] animate-ping" />
            <span className="text-[#89F5E7] font-bold">LIVE TELEMETRY STREAM</span>
            <span className="text-white/40">·</span>
            <span className="text-slate-300">REFRESH FREQUENCY: 1.5s</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-white/70">
            <span>TOTAL ROUTE DISTANCE: <strong className="text-white">29.1 KM</strong></span>
            <span>·</span>
            <span>AVG CORRIDOR SPEED: <strong className="text-white">34.2 KM/H</strong></span>
          </div>
        </div>

        {/* Interactive Schematic Route Track */}
        <div className="relative z-10 py-10 px-2 sm:px-6">
          <div className="relative">
            {/* The Main Transit Line Tube */}
            <div className="h-3 w-full bg-slate-700 rounded-full relative overflow-hidden">
              {/* Progress glow fill */}
              <div
                className="h-full bg-gradient-to-r from-[#D0102B] via-[#E11D48] to-[#0D9488] transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${activeBusPos}%` }}
              />
            </div>

            {/* Simulated Live Bus Capsule crawling on track */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 cursor-pointer transition-all duration-1000 ease-linear"
              style={{ left: `${activeBusPos}%` }}
              onClick={() => setSelectedBusPlate('SBS 3288Y')}
            >
              <div className="flex flex-col items-center group">
                {/* Floating Telemetry Tag */}
                <div className="bg-[#D0102B] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap mb-1 flex items-center gap-1 border border-white/30 animate-pulse">
                  <Bus className="w-2.5 h-2.5" />
                  <span>SBS 3288Y (DD)</span>
                </div>

                {/* Pulse Beacon Pin */}
                <div className="w-6 h-6 rounded-full bg-[#D0102B] border-2 border-white flex items-center justify-center shadow-lg ring-4 ring-[#D0102B]/40">
                  <Navigation className="w-3 h-3 text-white fill-current transform rotate-45" />
                </div>
              </div>
            </div>

            {/* Second simulated bus in trailing distance */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 cursor-pointer transition-all duration-1000 ease-linear"
              style={{ left: `${Math.max(5, (activeBusPos + 55) % 100)}%` }}
              onClick={() => setSelectedBusPlate('SBS 3412G')}
            >
              <div className="flex flex-col items-center group">
                <div className="bg-[#1E2B7B] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap mb-1 flex items-center gap-1 border border-white/20">
                  <Bus className="w-2.5 h-2.5" />
                  <span>SBS 3412G (DD)</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#1E2B7B] border-2 border-white flex items-center justify-center shadow-md">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
            </div>

            {/* Stop Stations along the track */}
            <div className="w-full flex justify-between relative mt-5">
              {stops.slice(0, 7).map((st, i) => (
                <div
                  key={st.stopCode}
                  onClick={() => {
                    if (soundEnabled) playButtonTick();
                    onSelectStop(st.stopCode);
                  }}
                  className="flex flex-col items-center cursor-pointer group max-w-[80px] sm:max-w-[100px] text-center"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#1E2B7B] group-hover:bg-[#89F5E7] transition-colors mb-2" />
                  <span className="font-mono text-[9px] text-[#89F5E7] tracking-wider block">
                    {st.stopCode}
                  </span>
                  <span className="font-geist text-[11px] font-semibold text-slate-200 group-hover:text-white line-clamp-2 transition-colors">
                    {st.stopName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Bus Telemetry Cockpit Box */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/5 border border-white/10 p-3 rounded">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              Monitored Vehicle
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-geist font-black text-lg text-white">
                {selectedBusPlate}
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                DOUBLE DECKER
              </span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              GPS Speed & Telemetry
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Gauge className="w-4 h-4 text-[#89F5E7]" />
              <span className="font-geist font-bold text-lg text-white">
                34.0 km/h
              </span>
              <span className="text-xs text-slate-300">Optimal Velocity</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              LTA Passenger Loading
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-3 h-3 rounded-full bg-[#15803D]"></span>
              <span className="font-geist font-bold text-base text-emerald-400">
                Seats Available (SEA)
              </span>
              <span className="text-xs text-slate-400">32% Full</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Corridor Interchanges Grid */}
      <div className="mt-4">
        <h3 className="font-geist font-bold text-sm text-[#141B2B] mb-2 uppercase tracking-wide">
          Key Intermodal Nodes along Corridor {routeDetail.serviceNo}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stops.filter(s => s.isInterchange).map((stop) => (
            <div
              key={stop.stopCode}
              onClick={() => {
                if (soundEnabled) playButtonTick();
                onSelectStop(stop.stopCode);
              }}
              className="p-3 bg-[#F4F5F9] hover:bg-[#E9EDFF] border border-[#D9DDE8] rounded-[4px] cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#1E2B7B]">
                  B/S {stop.stopCode}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {stop.distanceKm.toFixed(1)} km
                </span>
              </div>
              <h4 className="font-geist font-bold text-xs text-[#141B2B] mt-1 line-clamp-1">
                {stop.stopName}
              </h4>
              <p className="text-[11px] text-slate-500 font-inter truncate">
                {stop.roadName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
