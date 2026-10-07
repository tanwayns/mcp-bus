export type LoadStatus = 'SEA' | 'SDA' | 'LSD'; // Seats Available, Standing Available, Limited Standing
export type VehicleType = 'SD' | 'DD' | 'BD'; // Single Decker, Double Decker, Bendy
export type ServiceCategory = 'Trunk' | 'Feeder' | 'Express' | 'CityDirect';

export interface MRTTransfer {
  code: string; // e.g. 'NS24', 'NE6', 'CC1'
  line: 'NSL' | 'EWL' | 'NEL' | 'CCL' | 'DTL' | 'TEL';
  stationName: string;
}

export interface BusArrivalSlot {
  etaMinutes: number; // 0 means 'Arr'
  etaTimestamp: string; // e.g. '21:42'
  load: LoadStatus;
  occupancyPercent: number;
  vehicleType: VehicleType;
  wheelchairAccessible: boolean;
  busPlate: string;
  speedKmh?: number;
}

export interface BusServiceArrival {
  serviceNo: string;
  category: ServiceCategory;
  operator: 'SBS Transit' | 'SMRT' | 'Tower Transit' | 'Go-Ahead';
  destination: string;
  subtext: string; // e.g. "via Orchard Blvd · Loop at Marine Parade"
  origin: string;
  nextBus: BusArrivalSlot;
  secondBus: BusArrivalSlot;
  thirdBus: BusArrivalSlot;
  isBookmarked?: boolean;
}

export interface RouteStop {
  stopCode: string;
  roadName: string;
  stopName: string;
  sequence: number;
  distanceKm: number;
  transfers?: MRTTransfer[];
  isInterchange?: boolean;
  hasActiveBus?: boolean;
  activeBusPlate?: string;
  activeBusLoad?: LoadStatus;
  activeBusSpeed?: number;
}

export interface BusRouteDetail {
  serviceNo: string;
  category: ServiceCategory;
  operator: 'SBS Transit' | 'SMRT';
  origin: string;
  destination: string;
  operatingHours: string;
  frequencyPeak: string;
  frequencyOffPeak: string;
  stops: RouteStop[];
}

export interface BusStop {
  code: string;
  name: string;
  road: string;
  distanceMeters?: number;
  transfers?: MRTTransfer[];
  services: string[];
}

export interface NetworkAdvisory {
  id: string;
  title: string;
  category: 'Diversion' | 'Maintenance' | 'Crowd Notice' | 'Extension';
  severity: 'normal' | 'urgent' | 'info';
  timestamp: string;
  affectedServices: string[];
  description: string;
  validUntil: string;
}
