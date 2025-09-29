import fs from 'fs/promises';
import path from 'path';
import { ServiceRequestFormValues, DiagnosticFormValues } from './schemas';

const DATA_DIR = path.join(process.cwd(), 'data');
const SERVICE_DB = path.join(DATA_DIR, 'service_requests.json');
const DIAGNOSTIC_DB = path.join(DATA_DIR, 'diagnostics.json');

export type ServiceRequestRecord = ServiceRequestFormValues & {
  id: string;
  createdAt: string;
};

export type DiagnosticRecord = DiagnosticFormValues & {
  id: string;
  createdAt: string;
  aiOutput?: any;
};

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // ignore
  }
}

async function readJson(file: string): Promise<any[]> {
  try {
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function writeJson(file: string, data: any[]) {
  await ensureDataDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
}

function makeId(prefix = '') {
  return prefix + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}

export async function saveServiceRequest(values: ServiceRequestFormValues): Promise<ServiceRequestRecord> {
  const records = await readJson(SERVICE_DB);
  const record: ServiceRequestRecord = {
    ...values,
    id: makeId('SR-'),
    createdAt: new Date().toISOString(),
  } as any;
  records.push(record);
  await writeJson(SERVICE_DB, records);
  return record;
}

export async function listServiceRequests(): Promise<ServiceRequestRecord[]> {
  return readJson(SERVICE_DB);
}

export async function getServiceRequestById(id: string): Promise<ServiceRequestRecord | undefined> {
  const records: ServiceRequestRecord[] = await readJson(SERVICE_DB);
  return records.find(r => r.id === id);
}

export async function saveDiagnostic(values: DiagnosticFormValues, aiOutput?: any): Promise<DiagnosticRecord> {
  const records = await readJson(DIAGNOSTIC_DB);
  const record: DiagnosticRecord = {
    ...values,
    id: makeId('DIAG-'),
    createdAt: new Date().toISOString(),
    aiOutput,
  } as any;
  records.push(record);
  await writeJson(DIAGNOSTIC_DB, records);
  return record;
}

export async function listDiagnostics(): Promise<DiagnosticRecord[]> {
  return readJson(DIAGNOSTIC_DB);
}

export async function getDiagnosticById(id: string): Promise<DiagnosticRecord | undefined> {
  const records: DiagnosticRecord[] = await readJson(DIAGNOSTIC_DB);
  return records.find(r => r.id === id);
}
