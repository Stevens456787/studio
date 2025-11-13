'use client';

import { useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, Star, Clock, MapPin, BriefcaseBusiness, Loader2 } from 'lucide-react';
import { logTechnicianJob } from '@/app/actions/jobs';
import { useToast } from '@/hooks/use-toast';

interface Technician {
  id: string;
  name: string;
  expertise: string[];
  rating: number;
  availability: string;
  jobsCompleted: number;
  location: string;
}

interface TechnicianCardProps {
  technician: Technician;
}

export default function TechnicianCard({ technician }: TechnicianCardProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const initials = technician.name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleRequest = () => {
    startTransition(async () => {
      const result = await logTechnicianJob({
        technicianId: technician.id,
        technicianName: technician.name,
        source: 'technician-card',
      });
      toast({
        title: result.success ? 'Job created' : 'Request failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    });
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 bg-muted">
        <div className="flex h-48 w-full items-center justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
            {initials}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-xl mb-1 flex items-center gap-2">
          <UserCheck className="text-primary h-6 w-6" />
          {technician.name}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span>{technician.rating.toFixed(1)}</span>
          <span className="mx-1 text-border">|</span>
          <BriefcaseBusiness className="h-4 w-4" />
          <span>{technician.jobsCompleted} jobs</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Clock className="h-4 w-4" />
          <span>{technician.availability}</span>
          <span className="mx-1 text-border">|</span>
          <MapPin className="h-4 w-4" />
          <span>{technician.location}</span>
        </div>
        <CardDescription className="mb-4">
          Specializes in:{' '}
          {technician.expertise.map(exp => (
            <Badge key={exp} variant="secondary" className="mr-1 mb-1">
              {exp}
            </Badge>
          ))}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={isPending}
          onClick={handleRequest}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Job...
            </>
          ) : (
            <>Request {technician.name.split(' , ')[0]}</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
