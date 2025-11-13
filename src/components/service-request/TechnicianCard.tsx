import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, Star, Clock, MapPin, BriefcaseBusiness } from 'lucide-react';

interface Technician {
  id: string;
  name: string;
  expertise: string[];
  rating: number;
  availability: string; // e.g., "Available Now", "Next available: Tomorrow Morning"
  avatarUrl: string;
  jobsCompleted: number;
  location: string;
}

interface TechnicianCardProps {
  technician: Technician;
}

export default function TechnicianCard({ technician }: TechnicianCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          <Image 
            src={technician.avatarUrl} 
            alt={`${technician.name} - Technician`} 
            layout="fill" 
            objectFit="cover" 
            data-ai-hint="profile person" 
          />
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
          <span className="mx-1 text-border">•</span>
          <BriefcaseBusiness className="h-4 w-4" />
          <span>{technician.jobsCompleted} jobs</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Clock className="h-4 w-4" />
          <span>{technician.availability}</span>
          <span className="mx-1 text-border">•</span>
          <MapPin className="h-4 w-4" />
          <span>{technician.location}</span>
        </div>
        <CardDescription className="mb-4">
          Specializes in: {technician.expertise.map(exp => <Badge key={exp} variant="secondary" className="mr-1 mb-1">{exp}</Badge>)}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Request {technician.name.split(' , ')[0]}
        </Button>
      </CardFooter>
    </Card>
  );
}
