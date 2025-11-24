import fs from 'fs/promises';
import path from 'path';
import { adminFirestore } from './firebase-admin';
import { ServiceRequestFormValues, DiagnosticFormValues } from './schemas';

const SERVICE_COLLECTION = adminFirestore?.collection('serviceRequests');
const DIAGNOSTIC_COLLECTION = adminFirestore?.collection('diagnostics');
const TRACKING_COLLECTION = adminFirestore?.collection('technicianTracking');
const JOB_COLLECTION = adminFirestore?.collection('jobs');
const TECHNICIAN_COLLECTION = adminFirestore?.collection('technicians');

const DATA_DIR = path.join(process.cwd(), 'data');
const SERVICE_DB = path.join(DATA_DIR, 'service_requests.json');
const DIAGNOSTIC_DB = path.join(DATA_DIR, 'diagnostics.json');
const TRACKING_DB = path.join(DATA_DIR, 'technician_tracking.json');
const JOB_DB = path.join(DATA_DIR, 'jobs.json');
const TECHNICIAN_DB = path.join(DATA_DIR, 'technicians.json');

export type ServiceRequestRecord = ServiceRequestFormValues & {
  id: string;
  createdAt: string;
  status: string;
};

export type DiagnosticRecord = DiagnosticFormValues & {
  id: string;
  createdAt: string;
  aiOutput?: any;
};

export interface TechnicianLocationRecord {
  requestId: string;
  technicianName: string;
  startLat: number;
  startLng: number;
  destinationLat: number;
  destinationLng: number;
  currentLat: number;
  currentLng: number;
  progress: number;
  startedAt: string;
  durationMinutes: number;
  etaMinutes: number;
  speedKmh: number;
  headingDegrees: number;
  trafficDelayMinutes: number;
  lastUpdated: string;
}

export interface JobRecord {
  id: string;
  technicianId: string;
  technicianName: string;
  status: string;
  requestedAt: string;
  source?: string;
}

export interface JobInput {
  technicianId: string;
  technicianName: string;
  source?: string;
}

export interface TechnicianRecord {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  specialties: string[];
  coverageAreas: string[];
  certifications: string[];
  status: 'pending_review' | 'approved' | 'active' | 'inactive';
  availabilityStatus: 'available_now' | 'next_slot' | 'off';
  capacity: number;
  verificationDocs?: string[];
  createdAt: string;
  updatedAt: string;
}

function makeId(prefix = '') {
  return prefix + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true }).catch(() => undefined);
}

async function readJson<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeJson<T>(file: string, data: T[]) {
  await ensureDataDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
}

function normalizeServiceRecord(record: ServiceRequestRecord): ServiceRequestRecord {
  return {
    ...record,
    status: record.status ?? 'pending',
    preferredDate:
      record.preferredDate instanceof Date
        ? record.preferredDate
        : new Date(record.preferredDate as unknown as string),
  };
}

function deserializeServiceRequestDoc(doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): ServiceRequestRecord {
  const data = doc.data();
  if (!data) {
    throw new Error('Service request not found');
  }
  return normalizeServiceRecord({
    ...(data as Omit<ServiceRequestRecord, 'preferredDate'>),
    preferredDate: data.preferredDate ? new Date(data.preferredDate) : new Date(),
    id: data.id ?? doc.id,
    createdAt: data.createdAt ?? doc.createTime?.toDate().toISOString() ?? new Date().toISOString(),
  } as ServiceRequestRecord);
}

function deserializeDiagnosticDoc(doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): DiagnosticRecord {
  const data = doc.data();
  if (!data) {
    throw new Error('Diagnostic not found');
  }
  return {
    ...(data as DiagnosticRecord),
    id: data.id ?? doc.id,
    createdAt: data.createdAt ?? doc.createTime?.toDate().toISOString() ?? new Date().toISOString(),
  };
}

export async function saveServiceRequest(values: ServiceRequestFormValues): Promise<ServiceRequestRecord> {
  if (SERVICE_COLLECTION) {
    const id = makeId('SR-');
    const createdAt = new Date().toISOString();
    const payload = {
      ...values,
      id,
      preferredDate: values.preferredDate?.toISOString(),
      createdAt,
      status: 'pending',
    };
    await SERVICE_COLLECTION.doc(id).set(payload);
    return {
      ...values,
      id,
      createdAt,
      status: 'pending',
    };
  }

  const records = await readJson<ServiceRequestRecord>(SERVICE_DB);
  const record: ServiceRequestRecord = {
    ...values,
    id: makeId('SR-'),
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  records.push(record);
  await writeJson(SERVICE_DB, records);
  return record;
}

export async function listServiceRequests(): Promise<ServiceRequestRecord[]> {
  if (SERVICE_COLLECTION) {
    const snapshot = await SERVICE_COLLECTION.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(deserializeServiceRequestDoc);
  }
  const records = await readJson<ServiceRequestRecord>(SERVICE_DB);
  return records.map(normalizeServiceRecord);
}

export async function getServiceRequestById(id: string): Promise<ServiceRequestRecord | undefined> {
  if (SERVICE_COLLECTION) {
    const doc = await SERVICE_COLLECTION.doc(id).get();
    if (!doc.exists) return undefined;
    return deserializeServiceRequestDoc(doc);
  }
  const records = await readJson<ServiceRequestRecord>(SERVICE_DB);
  const record = records.find(r => r.id === id);
  return record ? normalizeServiceRecord(record) : undefined;
}

export async function findServiceRequestsByContact(contact: string): Promise<ServiceRequestRecord[]> {
  const normalized = contact.trim().toLowerCase();
  const requests = await listServiceRequests();
  return requests.filter(req => {
    const phoneMatch = req.phoneNumber?.toLowerCase() === normalized;
    const emailMatch = (req.email ?? '').toLowerCase() === normalized;
    return phoneMatch || emailMatch;
  });
}

export async function saveDiagnostic(values: DiagnosticFormValues, aiOutput?: any): Promise<DiagnosticRecord> {
  if (DIAGNOSTIC_COLLECTION) {
    const id = makeId('DIAG-');
    const createdAt = new Date().toISOString();
    const payload = { ...values, aiOutput, id, createdAt };
    await DIAGNOSTIC_COLLECTION.doc(id).set(payload);
    return payload;
  }
  const records = await readJson<DiagnosticRecord>(DIAGNOSTIC_DB);
  const record: DiagnosticRecord = {
    ...values,
    id: makeId('DIAG-'),
    createdAt: new Date().toISOString(),
    aiOutput,
  };
  records.push(record);
  await writeJson(DIAGNOSTIC_DB, records);
  return record;
}

export async function listDiagnostics(): Promise<DiagnosticRecord[]> {
  if (DIAGNOSTIC_COLLECTION) {
    const snapshot = await DIAGNOSTIC_COLLECTION.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(deserializeDiagnosticDoc);
  }
  return readJson<DiagnosticRecord>(DIAGNOSTIC_DB);
}

export async function getDiagnosticById(id: string): Promise<DiagnosticRecord | undefined> {
  if (DIAGNOSTIC_COLLECTION) {
    const doc = await DIAGNOSTIC_COLLECTION.doc(id).get();
    if (!doc.exists) return undefined;
    return deserializeDiagnosticDoc(doc);
  }
  const records = await readJson<DiagnosticRecord>(DIAGNOSTIC_DB);
  return records.find(r => r.id === id);
}

export async function upsertTechnicianLocation(record: TechnicianLocationRecord): Promise<TechnicianLocationRecord> {
  if (TRACKING_COLLECTION) {
    await TRACKING_COLLECTION.doc(record.requestId).set(record, { merge: true });
    return record;
  }
  const records = await readJson<TechnicianLocationRecord>(TRACKING_DB);
  const index = records.findIndex(r => r.requestId === record.requestId);
  if (index >= 0) {
    records[index] = record;
  } else {
    records.push(record);
  }
  await writeJson(TRACKING_DB, records);
  return record;
}

export async function getTechnicianLocationRecord(requestId: string): Promise<TechnicianLocationRecord | undefined> {
  if (TRACKING_COLLECTION) {
    const doc = await TRACKING_COLLECTION.doc(requestId).get();
    if (!doc.exists) return undefined;
    return doc.data() as TechnicianLocationRecord;
  }
  const records = await readJson<TechnicianLocationRecord>(TRACKING_DB);
  return records.find(r => r.requestId === requestId);
}

export async function saveJob(input: JobInput): Promise<JobRecord> {
  const id = makeId('JOB-');
  const record: JobRecord = {
    id,
    technicianId: input.technicianId,
    technicianName: input.technicianName,
    status: 'pending',
    requestedAt: new Date().toISOString(),
    source: input.source,
  };

  if (JOB_COLLECTION) {
    try {
      await JOB_COLLECTION.doc(id).set(record);
      return record;
    } catch (error) {
      console.error('Failed to save job to Firestore:', error);
      // Fall back to local storage if Firestore fails
    }
  }

  const records = await readJson<JobRecord>(JOB_DB);
  records.push(record);
  await writeJson(JOB_DB, records);
  return record;
}

export async function findJobsByTechnician(technicianId: string): Promise<JobRecord[]> {
  if (JOB_COLLECTION) {
    try {
      const snapshot = await JOB_COLLECTION.where('technicianId', '==', technicianId).get();
      return snapshot.docs.map(doc => doc.data() as JobRecord);
    } catch (error) {
      console.error('Failed to fetch jobs from Firestore:', error);
    }
  }
  const records = await readJson<JobRecord>(JOB_DB);
  return records.filter(job => job.technicianId === technicianId);
}

export async function saveTechnician(record: Omit<TechnicianRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<TechnicianRecord> {
  const id = makeId('TECH-');
  const now = new Date().toISOString();
  const payload: TechnicianRecord = {
    ...record,
    id,
    createdAt: now,
    updatedAt: now,
  };

  if (TECHNICIAN_COLLECTION) {
    try {
      await TECHNICIAN_COLLECTION.doc(id).set(payload);
      return payload;
    } catch (error) {
      console.error('Failed to save technician to Firestore:', error);
    }
  }

  const records = await readJson<TechnicianRecord>(TECHNICIAN_DB);
  records.push(payload);
  await writeJson(TECHNICIAN_DB, records);
  return payload;
}

export async function updateTechnicianStatus(id: string, updates: Partial<TechnicianRecord>): Promise<TechnicianRecord | undefined> {
  const now = new Date().toISOString();
  if (TECHNICIAN_COLLECTION) {
    try {
      await TECHNICIAN_COLLECTION.doc(id).set({ ...updates, updatedAt: now }, { merge: true });
      const doc = await TECHNICIAN_COLLECTION.doc(id).get();
      return doc.data() as TechnicianRecord;
    } catch (error) {
      console.error('Failed to update technician in Firestore:', error);
    }
  }
  const records = await readJson<TechnicianRecord>(TECHNICIAN_DB);
  const index = records.findIndex(t => t.id === id);
  if (index >= 0) {
    records[index] = { ...records[index], ...updates, updatedAt: now } as TechnicianRecord;
    await writeJson(TECHNICIAN_DB, records);
    return records[index];
  }
  return undefined;
}

export async function listTechnicians(): Promise<TechnicianRecord[]> {
  if (TECHNICIAN_COLLECTION) {
    try {
      const snapshot = await TECHNICIAN_COLLECTION.get();
      return snapshot.docs.map(doc => doc.data() as TechnicianRecord);
    } catch (error) {
      console.error('Failed to list technicians from Firestore:', error);
    }
  }
  return readJson<TechnicianRecord>(TECHNICIAN_DB);
}

export async function getTechnicianById(id: string): Promise<TechnicianRecord | undefined> {
  if (TECHNICIAN_COLLECTION) {
    try {
      const doc = await TECHNICIAN_COLLECTION.doc(id).get();
      if (!doc.exists) return undefined;
      return doc.data() as TechnicianRecord;
    } catch (error) {
      console.error('Failed to fetch technician from Firestore:', error);
    }
  }
  const records = await readJson<TechnicianRecord>(TECHNICIAN_DB);
  return records.find(t => t.id === id);
}
