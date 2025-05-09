import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  technicianName: string;
  requestId: string;
}

export default function MapView({ technicianName, requestId }: MapViewProps) {
  // In a real app, this would integrate with a mapping library (e.g., Vis.GL, Google Maps)
  // and use real-time location data.
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Technician Live Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Tracking technician {technicianName} for request ID: {requestId}. 
          (Map below is a placeholder).
        </p>
        <div className="aspect-video w-full bg-muted rounded-md overflow-hidden relative">
          <Image
            src="https://picsum.photos/seed/map-tracking/800/450"
            alt="Map showing technician location"
            layout="fill"
            objectFit="cover"
            data-ai-hint="map city"
            className="transition-transform duration-500 hover:scale-105"
          />
           <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <MapPin className="h-10 w-10 text-red-500 animate-pulse" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background px-2 py-1 rounded text-xs shadow">Technician</span>
          </div>
           <div aria-hidden="true" className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2">
            <MapPin className="h-8 w-8 text-blue-500" />
             <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background px-2 py-1 rounded text-xs shadow">You</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
