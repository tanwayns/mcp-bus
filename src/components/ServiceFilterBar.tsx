import React from 'react';
import { Search, X, Filter, Bookmark, Info } from 'lucide-react';
import { playButtonTick } from '../utils/audioChime';

interface ServiceFilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterDDOnly: boolean;
  setFilterDDOnly: (val: boolean) => void;
  filterSEAOnly: boolean;
  setFilterSEAOnly: (val: boolean) => void;
  filterBookmarkedOnly: boolean;
  setFilterBookmarkedOnly: (val: boolean) => void;
  soundEnabled: boolean;
}

export const ServiceFilterBar: React.FC<ServiceFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  filterDDOnly,
  setFilterDDOnly,
  filterSEAOnly,
  setFilterSEAOnly,
  filterBookmarkedOnly,
  setFilterBookmarkedOnly,
  soundEnabled,
}) => {
  return (
    <div className="bg-white border border-[#D9DDE8] rounded-[6px] p-3 sm:p-4 mb-4 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search Input matching design specs */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-[#1E2B7B]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service number (e.g. 65), bus stop code (03211), or street..."
            className="w-full pl-9 pr-9 py-2 bg-[#F9FAFC] border border-[#D9DDE8] rounded-[4px] text-xs sm:text-sm font-inter text-[#141B2B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E2B7B] focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                if (soundEnabled) playButtonTick();
                setSearchQuery('');
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls (Segmented Pill Buttons) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 mr-1 hidden sm:flex">
            <Filter className="w-3.5 h-3.5" />
            <span>FILTERS:</span>
          </div>

          {/* Double Decker Filter */}
          <button
            onClick={() => {
              if (soundEnabled) playButtonTick();
              setFilterDDOnly(!filterDDOnly);
            }}
            className={`px-2.5 py-1.5 rounded-[4px] text-xs font-semibold font-geist transition-all flex items-center gap-1 cursor-pointer border ${
              filterDDOnly
                ? 'bg-[#1E2B7B] text-white border-[#1E2B7B] shadow-xs'
                : 'bg-[#F4F5F9] text-slate-700 border-[#D9DDE8] hover:bg-[#E9EDFF]'
            }`}
          >
            <span>Double Decker (DD)</span>
          </button>

          {/* Seats Available Filter */}
          <button
            onClick={() => {
              if (soundEnabled) playButtonTick();
              setFilterSEAOnly(!filterSEAOnly);
            }}
            className={`px-2.5 py-1.5 rounded-[4px] text-xs font-semibold font-geist transition-all flex items-center gap-1 cursor-pointer border ${
              filterSEAOnly
                ? 'bg-[#15803D] text-white border-[#15803D] shadow-xs'
                : 'bg-[#F4F5F9] text-slate-700 border-[#D9DDE8] hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            <span>Seats Available (SEA)</span>
          </button>

          {/* Saved Filter */}
          <button
            onClick={() => {
              if (soundEnabled) playButtonTick();
              setFilterBookmarkedOnly(!filterBookmarkedOnly);
            }}
            className={`px-2.5 py-1.5 rounded-[4px] text-xs font-semibold font-geist transition-all flex items-center gap-1 cursor-pointer border ${
              filterBookmarkedOnly
                ? 'bg-[#D0102B] text-white border-[#D0102B] shadow-xs'
                : 'bg-[#F4F5F9] text-slate-700 border-[#D9DDE8] hover:bg-rose-50'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>Saved</span>
          </button>
        </div>
      </div>

      {/* Official LTA Passenger Loading Convention Legend */}
      <div className="mt-3 pt-2.5 border-t border-[#ECEEF5] flex flex-wrap items-center justify-between gap-2 text-[11px] font-inter text-slate-600">
        <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500 uppercase">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Official LTA Passenger Load Standard:</span>
        </div>

        <div className="flex items-center gap-3.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]"></span>
            <span className="font-medium text-[#15803D]">Seats Available (SEA)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
            <span className="font-medium text-[#D97706]">Standing Available (SDA)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>
            <span className="font-medium text-[#DC2626]">Limited Standing (LSD)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
