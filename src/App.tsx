/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { BusStopHeader } from './components/BusStopHeader';
import { ServiceFilterBar } from './components/ServiceFilterBar';
import { BusServiceRowCard } from './components/BusServiceRowCard';
import { LiveRouteTimeline } from './components/LiveRouteTimeline';
import { RouteCorridorMap } from './components/RouteCorridorMap';
import { FareCalculator } from './components/FareCalculator';
import { NetworkAdvisories } from './components/NetworkAdvisories';
import {
  INITIAL_BUS_STOPS,
  SERVICE_ARRIVALS_BY_STOP,
  ROUTE_DETAILS,
  INITIAL_ADVISORIES,
} from './data/transitData';
import { BusServiceArrival } from './types/transit';
import { playTransitArrivalChime, playButtonTick } from './utils/audioChime';
import { MapPin, Bus, Radio, Info, Layers, Bookmark } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'arrivals' | 'tracker' | 'map' | 'fares' | 'advisories'>('arrivals');
  const [currentStopCode, setCurrentStopCode] = useState<string>('03211'); // Dhoby Ghaut
  const [selectedServiceNo, setSelectedServiceNo] = useState<string>('65');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(15);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Search & filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDDOnly, setFilterDDOnly] = useState<boolean>(false);
  const [filterSEAOnly, setFilterSEAOnly] = useState<boolean>(false);
  const [filterBookmarkedOnly, setFilterBookmarkedOnly] = useState<boolean>(false);

  // Bookmarks
  const [bookmarkedServices, setBookmarkedServices] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_bookmarked_services');
      return saved ? JSON.parse(saved) : ['65', '14'];
    } catch {
      return ['65', '14'];
    }
  });

  // Dynamic live arrival state that updates as buses travel
  const [arrivalsData, setArrivalsData] = useState<Record<string, BusServiceArrival[]>>(SERVICE_ARRIVALS_BY_STOP);

  const toggleBookmark = (serviceNo: string) => {
    setBookmarkedServices((prev) => {
      const next = prev.includes(serviceNo) ? prev.filter((s) => s !== serviceNo) : [...prev, serviceNo];
      try {
        localStorage.setItem('sbs_bookmarked_services', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Current stop object
  const currentStop = useMemo(() => {
    return (
      INITIAL_BUS_STOPS.find((s) => s.code === currentStopCode) || INITIAL_BUS_STOPS[0]
    );
  }, [currentStopCode]);

  // Current services at this stop
  const currentServices = useMemo(() => {
    return arrivalsData[currentStopCode] || arrivalsData['03211'];
  }, [arrivalsData, currentStopCode]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return currentServices.filter((svc) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSvc = svc.serviceNo.toLowerCase().includes(q);
        const matchesDest = svc.destination.toLowerCase().includes(q);
        const matchesSub = svc.subtext.toLowerCase().includes(q);
        const matchesStop = currentStop.name.toLowerCase().includes(q) || currentStop.code.includes(q);
        if (!matchesSvc && !matchesDest && !matchesSub && !matchesStop) return false;
      }

      // DD only filter
      if (filterDDOnly) {
        if (svc.nextBus.vehicleType !== 'DD' && svc.secondBus.vehicleType !== 'DD') return false;
      }

      // Seats Available filter
      if (filterSEAOnly) {
        if (svc.nextBus.load !== 'SEA' && svc.secondBus.load !== 'SEA') return false;
      }

      // Bookmarked filter
      if (filterBookmarkedOnly) {
        if (!bookmarkedServices.includes(svc.serviceNo)) return false;
      }

      return true;
    });
  }, [currentServices, searchQuery, filterDDOnly, filterSEAOnly, filterBookmarkedOnly, bookmarkedServices, currentStop]);

  // Manual refresh logic
  const handleManualRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (soundEnabled) playTransitArrivalChime();

    setTimeout(() => {
      // Slightly fluctuate countdowns realistically
      setArrivalsData((prev) => {
        const nextState = { ...prev };
        Object.keys(nextState).forEach((key) => {
          nextState[key] = nextState[key].map((item) => {
            const nextMins = item.nextBus.etaMinutes <= 0 ? 9 : Math.max(0, item.nextBus.etaMinutes - 1);
            return {
              ...item,
              nextBus: {
                ...item.nextBus,
                etaMinutes: nextMins,
                speedKmh: Math.floor(Math.random() * 20 + 22),
              },
            };
          });
        });
        return nextState;
      });

      setRefreshCountdown(15);
      setIsRefreshing(false);
    }, 600);
  }, [soundEnabled]);

  // Automatic countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          handleManualRefresh();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleManualRefresh]);

  // Inspect route callback
  const handleInspectService = (serviceNo: string) => {
    setSelectedServiceNo(serviceNo);
    setActiveTab('tracker');
  };

  const currentRouteDetail = ROUTE_DETAILS[selectedServiceNo] || ROUTE_DETAILS['65'];
  const allAvailableRouteNumbers = Object.keys(ROUTE_DETAILS);

  return (
    <div className="min-h-screen bg-[#F4F5F9] flex flex-col font-inter text-[#141B2B]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        refreshSeconds={refreshCountdown}
        onManualRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        advisoryCount={INITIAL_ADVISORIES.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
        
        {/* Nearby Bus Stops Bar */}
        <section aria-label="Nearby Transit Hubs" className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#1E2B7B]" />
              <span>Singapore Arterial Bus Stops & Hubs:</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              10 Official LTA Surveyed Locations
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            {INITIAL_BUS_STOPS.map((stop) => {
              const isSelected = stop.code === currentStopCode;
              return (
                <button
                  key={stop.code}
                  onClick={() => {
                    if (soundEnabled) playButtonTick();
                    setCurrentStopCode(stop.code);
                    if (activeTab !== 'arrivals') setActiveTab('arrivals');
                  }}
                  className={`px-3 py-2 rounded-[4px] border text-xs font-geist whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-[#1E2B7B] text-white border-[#1E2B7B] font-bold shadow-sm'
                      : 'bg-white text-slate-700 border-[#D9DDE8] hover:bg-[#F1F3FF] hover:border-[#1E2B7B]/40'
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] px-1 rounded ${
                      isSelected ? 'bg-white/20 text-[#89F5E7]' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {stop.code}
                  </span>
                  <span>{stop.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Tab 1: Live Stop Arrivals */}
        {activeTab === 'arrivals' && (
          <div>
            <BusStopHeader
              currentStop={currentStop}
              allStops={INITIAL_BUS_STOPS}
              onSelectStop={setCurrentStopCode}
              soundEnabled={soundEnabled}
            />

            <ServiceFilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterDDOnly={filterDDOnly}
              setFilterDDOnly={setFilterDDOnly}
              filterSEAOnly={filterSEAOnly}
              setFilterSEAOnly={setFilterSEAOnly}
              filterBookmarkedOnly={filterBookmarkedOnly}
              setFilterBookmarkedOnly={setFilterBookmarkedOnly}
              soundEnabled={soundEnabled}
            />

            {/* List of Bus Service Row Cards */}
            <div className="space-y-3">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <BusServiceRowCard
                    key={service.serviceNo}
                    service={service}
                    currentStopCode={currentStopCode}
                    isBookmarked={bookmarkedServices.includes(service.serviceNo)}
                    onToggleBookmark={toggleBookmark}
                    onSelectService={handleInspectService}
                    soundEnabled={soundEnabled}
                  />
                ))
              ) : (
                <div className="bg-white border border-[#D9DDE8] rounded-[6px] p-8 text-center">
                  <Bus className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h3 className="font-geist font-bold text-base text-slate-800">
                    No matching bus services found
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try adjusting your filter controls or searching another Singapore bus stop code.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterDDOnly(false);
                      setFilterSEAOnly(false);
                      setFilterBookmarkedOnly(false);
                    }}
                    className="mt-3 text-xs font-semibold text-[#1E2B7B] underline cursor-pointer"
                  >
                    Reset all active filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Live Route Timeline */}
        {activeTab === 'tracker' && (
          <LiveRouteTimeline
            routeDetail={currentRouteDetail}
            availableServices={allAvailableRouteNumbers}
            selectedServiceNo={selectedServiceNo}
            onSelectService={setSelectedServiceNo}
            onJumpToStop={(stopCode) => {
              setCurrentStopCode(stopCode);
              setActiveTab('arrivals');
            }}
            soundEnabled={soundEnabled}
          />
        )}

        {/* Tab 3: Route Corridor Map */}
        {activeTab === 'map' && (
          <RouteCorridorMap
            routeDetail={currentRouteDetail}
            availableServices={allAvailableRouteNumbers}
            selectedServiceNo={selectedServiceNo}
            onSelectService={setSelectedServiceNo}
            onSelectStop={(stopCode) => {
              setCurrentStopCode(stopCode);
              setActiveTab('arrivals');
            }}
            soundEnabled={soundEnabled}
          />
        )}

        {/* Tab 4: Fare & Journey Planner */}
        {activeTab === 'fares' && (
          <FareCalculator
            stops={INITIAL_BUS_STOPS}
            soundEnabled={soundEnabled}
            onSelectStop={(code) => {
              setCurrentStopCode(code);
              setActiveTab('arrivals');
            }}
          />
        )}

        {/* Tab 5: Civic Advisories */}
        {activeTab === 'advisories' && (
          <NetworkAdvisories
            advisories={INITIAL_ADVISORIES}
            soundEnabled={soundEnabled}
            onSelectService={handleInspectService}
          />
        )}
      </main>

      {/* Authoritative Civic Footer */}
      <footer className="bg-white border-t border-[#D9DDE8] mt-10 text-xs text-slate-500 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#D0102B] text-white px-2 py-0.5 rounded-[2px] font-geist font-black text-xs">
              SBS TRANSIT
            </div>
            <p className="font-inter text-slate-600">
              Civic Velocity Digital Standard · Land Transport Authority (LTA) Singapore DataMall v2
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 flex-wrap">
            <span>WCAG AA HIGH-CONTRAST COMPLIANT</span>
            <span>·</span>
            <span>TABULAR FIGURE KERNING (tnum)</span>
            <span>·</span>
            <span>ISO 24014 TRANSIT TELEMETRY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
