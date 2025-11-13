import MapView from '@/components/tracking/MapView';
import TechnicianStatusCard from '@/components/tracking/TechnicianStatusCard';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { getLiveTechnicianLocation } from '@/lib/tracking';

// This page would typically fetch real data based on requestId
// For now, we use mock data.

interface TrackPageProps {
  params: Promise<{ requestId: string }>;
}

// Mock status updates for demonstration
const mockStatusUpdates = [
  "Service request received and confirmed.",
  "Technician assigned: David Miller.",
  "Technician is preparing for departure.",
  "Technician en route.",
  "Traffic encountered, slight delay expected.",
  "Approaching service location.",
  "Technician has arrived.",
  "Service in progress.",
  "Service completed successfully."
];

export default async function TrackRequestPage({ params }: TrackPageProps) {
  const { requestId } = await params;

  const technicianName = "David Miller";

  let currentStatusMessage = "Fetching status...";
  let alertType: 'info' | 'warning' | 'success' = 'info';

  if (requestId.includes("error")) {
    currentStatusMessage = "There was an issue locating your service request. Please contact support.";
    alertType = 'warning';
  } else if (requestId.includes("completed")) {
    currentStatusMessage = "This service request has been completed. Thank you for using FieldAssist!";
    alertType = 'success';
  }

  if (alertType !== 'info') {
    const Icon = alertType === 'warning' ? AlertTriangle : CheckCircle;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Icon className={`h-16 w-16 mb-4 ${alertType === 'warning' ? 'text-destructive' : 'text-green-500'}`} />
        <h1 className="text-2xl font-semibold mb-2">Request ID: {requestId}</h1>
        <p className="text-lg text-muted-foreground">{currentStatusMessage}</p>
      </div>
    );
  }

  const liveLocation = await getLiveTechnicianLocation(requestId, technicianName);
  const initialEtaMinutes = liveLocation?.etaMinutes ?? 45;

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Track Your Service</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Request ID: <span className="font-semibold">{requestId}</span>
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <MapView technicianName={technicianName} requestId={requestId} initialLocation={liveLocation} />
        </div>
        <div className="lg:col-span-1">
          <TechnicianStatusCard 
            technicianName={technicianName} 
            initialEtaMinutes={initialEtaMinutes}
            statusUpdates={mockStatusUpdates} 
          />
        </div>
      </div>

      <Separator />

      <section className="bg-card p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><Info className="h-5 w-5 text-primary" />Important Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
          <li>ETA is an estimate and may vary due to traffic or unforeseen circumstances.</li>
          <li>You will be notified of any significant delays or changes.</li>
          <li>For urgent assistance, please contact our support line.</li>
        </ul>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  // Example of pre-rendering some tracking pages if needed, or can be fully dynamic
  return [
    { requestId: 'example-request-id' },
    { requestId: 'FA-123456' },
    { requestId: 'FA-789012-completed' }, // for testing completed state
    { requestId: 'FA-000000-error' }, // for testing error state
  ];
}
