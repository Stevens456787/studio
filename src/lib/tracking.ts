import { getTechnicianLocationRecord, upsertTechnicianLocation, type TechnicianLocationRecord } from './db';

const DEMO_ROUTES = [
  {
    start: { lat: -1.286389, lng: 36.817223 }, // Nairobi CBD
    end: { lat: -1.300761, lng: 36.784499 }, // Westlands
  },
  {
    start: { lat: -1.313611, lng: 36.7825 }, // Upper Hill
    end: { lat: -1.345, lng: 36.765 }, // Karen
  },
  {
    start: { lat: -1.281, lng: 36.845 }, // Pangani
    end: { lat: -1.2476, lng: 36.8634 }, // Runda
  },
];

export interface LiveTechnicianLocation {
  requestId: string;
  technicianName: string;
  lat: number;
  lng: number;
  startLat: number;
  startLng: number;
  destinationLat: number;
  destinationLng: number;
  etaMinutes: number;
  speedKmh: number;
  trafficDelayMinutes: number;
  lastUpdated: string;
  headingDegrees: number;
  progress: number;
}

export async function getLiveTechnicianLocation(requestId: string, technicianName = 'FieldAssist Pro'): Promise<LiveTechnicianLocation> {
  let record = await getTechnicianLocationRecord(requestId);
  if (!record) {
    record = createTrackingRecord(requestId, technicianName);
  } else if (technicianName && technicianName !== record.technicianName) {
    record.technicianName = technicianName;
  }

  const advanced = advanceRecord(record);
  await upsertTechnicianLocation(advanced);

  return mapToLiveLocation(advanced);
}

function createTrackingRecord(requestId: string, technicianName: string): TechnicianLocationRecord {
  const route = DEMO_ROUTES[Math.floor(Math.random() * DEMO_ROUTES.length)];
  const durationMinutes = randomBetween(35, 65);
  const trafficDelayMinutes = randomBetween(0, 12);
  const startLat = route.start.lat + randomBetween(-0.01, 0.01);
  const startLng = route.start.lng + randomBetween(-0.01, 0.01);
  const destinationLat = route.end.lat + randomBetween(-0.005, 0.005);
  const destinationLng = route.end.lng + randomBetween(-0.005, 0.005);
  const now = new Date().toISOString();

  return {
    requestId,
    technicianName,
    startLat,
    startLng,
    destinationLat,
    destinationLng,
    currentLat: startLat,
    currentLng: startLng,
    progress: 0,
    startedAt: now,
    durationMinutes,
    etaMinutes: durationMinutes + trafficDelayMinutes,
    speedKmh: randomBetween(28, 55),
    headingDegrees: 0,
    trafficDelayMinutes,
    lastUpdated: now,
  };
}

function advanceRecord(record: TechnicianLocationRecord): TechnicianLocationRecord {
  const now = Date.now();
  const lastUpdated = new Date(record.lastUpdated).getTime();
  const elapsedMinutes = Math.max(0, (now - lastUpdated) / 60000);
  const totalTripMinutes = Math.max(10, record.durationMinutes + record.trafficDelayMinutes);
  const deltaProgress = elapsedMinutes / totalTripMinutes;
  const cappedProgress = Math.min(0.995, record.progress + deltaProgress);

  const currentLat = lerp(record.startLat, record.destinationLat, cappedProgress);
  const currentLng = lerp(record.startLng, record.destinationLng, cappedProgress);
  const etaMinutes = Math.max(1, Math.round((1 - cappedProgress) * totalTripMinutes));
  const headingDegrees = calculateHeading(currentLat, currentLng, record.destinationLat, record.destinationLng);
  const trafficDelayMinutes = adjustTrafficDelay(record.trafficDelayMinutes, cappedProgress);

  return {
    ...record,
    currentLat,
    currentLng,
    progress: cappedProgress,
    etaMinutes,
    headingDegrees,
    trafficDelayMinutes,
    lastUpdated: new Date(now).toISOString(),
  };
}

function mapToLiveLocation(record: TechnicianLocationRecord): LiveTechnicianLocation {
  return {
    requestId: record.requestId,
    technicianName: record.technicianName,
    lat: record.currentLat,
    lng: record.currentLng,
    startLat: record.startLat,
    startLng: record.startLng,
    destinationLat: record.destinationLat,
    destinationLng: record.destinationLng,
    etaMinutes: record.etaMinutes,
    speedKmh: record.speedKmh,
    trafficDelayMinutes: record.trafficDelayMinutes,
    lastUpdated: record.lastUpdated,
    headingDegrees: record.headingDegrees,
    progress: record.progress,
  };
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function calculateHeading(lat1: number, lng1: number, lat2: number, lng2: number) {
  const deltaLng = (lng2 - lng1) * (Math.PI / 180);
  const phi1 = lat1 * (Math.PI / 180);
  const phi2 = lat2 * (Math.PI / 180);
  const y = Math.sin(deltaLng) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLng);
  const radians = Math.atan2(y, x);
  return (radians * (180 / Math.PI) + 360) % 360;
}

function adjustTrafficDelay(currentDelay: number, progress: number) {
  if (progress > 0.9) {
    return 0;
  }
  const shouldChange = Math.random() < 0.3;
  if (!shouldChange) {
    return currentDelay;
  }
  const delta = Math.random() < 0.5 ? -1 : 1;
  return Math.max(0, Math.min(20, currentDelay + delta * randomBetween(0, 2)));
}
