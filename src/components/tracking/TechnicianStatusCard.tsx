'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, UserCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TechnicianStatusCardProps {
  technicianName: string;
  initialEtaMinutes: number; // Initial ETA in minutes
  statusUpdates: string[]; // Array of status messages
}

export default function TechnicianStatusCard({ technicianName, initialEtaMinutes, statusUpdates }: TechnicianStatusCardProps) {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [etaMinutes, setEtaMinutes] = useState(initialEtaMinutes);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    // Simulate ETA countdown and progress
    if (etaMinutes > 0) {
      const timer = setTimeout(() => {
        setEtaMinutes(prev => prev - 1);
        setProgressValue(prev => Math.min(100, prev + (100 / initialEtaMinutes)));
      }, 60 * 1000); // Update every minute
      return () => clearTimeout(timer);
    } else {
      setProgressValue(100);
    }
  }, [etaMinutes, initialEtaMinutes]);

  useEffect(() => {
    // Simulate status updates progression
    if (statusUpdates.length > 0 && currentStatusIndex < statusUpdates.length -1) {
      // Change status roughly based on progress
      const progressPoints = statusUpdates.length;
      const currentProgressPoint = Math.floor((progressValue / 100) * progressPoints);
      if (currentProgressPoint > currentStatusIndex) {
        setCurrentStatusIndex(currentProgressPoint);
      }
    }
     // If ETA is 0 or less, set to final status if not already
    if (etaMinutes <= 0 && currentStatusIndex < statusUpdates.length - 1) {
      setCurrentStatusIndex(statusUpdates.length - 1);
    }

  }, [progressValue, statusUpdates, currentStatusIndex, etaMinutes]);
  
  const currentStatusMessage = statusUpdates[currentStatusIndex] || "Status not available";
  const isFinalStatus = currentStatusIndex === statusUpdates.length - 1 && etaMinutes <= 0;


  const getStatusIcon = () => {
    if (isFinalStatus && (currentStatusMessage.toLowerCase().includes("arrived") || currentStatusMessage.toLowerCase().includes("completed"))) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    if (currentStatusMessage.toLowerCase().includes("delayed") || currentStatusMessage.toLowerCase().includes("issue")) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
    return <Truck className="h-5 w-5 text-primary" />;
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-primary" />
          Technician: {technicianName}
        </CardTitle>
        <CardDescription>Real-time service status and ETA.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" /> Estimated Time of Arrival (ETA)
            </span>
            <Badge variant={etaMinutes <= 5 ? (etaMinutes <=0 ? "default" : "destructive") : "secondary"}>
              {etaMinutes > 0 ? `${etaMinutes} min` : "Arrived"}
            </Badge>
          </div>
          <Progress value={progressValue} aria-label={`ETA progress: ${progressValue}%`} className="h-3" />
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Status:</h4>
          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-md">
            {getStatusIcon()}
            <p className="font-semibold">{currentStatusMessage}</p>
          </div>
        </div>

        {statusUpdates.length > 1 && (
           <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Status History:</h4>
            <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside max-h-24 overflow-y-auto">
              {statusUpdates.slice(0, currentStatusIndex + 1).reverse().map((update, index) => (
                <li key={index} className={index === 0 ? 'font-medium text-foreground' : ''}>{update}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
