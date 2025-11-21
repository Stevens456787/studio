'use client';

import { useMemo, useState } from 'react';
import TechnicianCard from '@/components/service-request/TechnicianCard';
import type { TechnicianProfile } from '@/data/technicians';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  technicians: TechnicianProfile[];
}

const availabilityBuckets = [
  { label: 'All availability', value: 'all' },
  { label: 'Available now', value: 'available' },
  { label: 'Within 2 hours', value: 'soon' },
  { label: 'Scheduled later', value: 'later' },
];

export default function TechnicianDirectory({ technicians }: Props) {
  const [locationQuery, setLocationQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [availability, setAvailability] = useState<string>('all');

  const expertiseOptions = useMemo(() => {
    const set = new Set<string>();
    technicians.forEach(tech => tech.expertise.forEach(exp => set.add(exp)));
    return Array.from(set);
  }, [technicians]);

  const filtered = useMemo(() => {
    return technicians.filter(tech => {
      const locationMatch = tech.location.toLowerCase().includes(locationQuery.toLowerCase());
      const categoryMatch = category === 'all' || tech.expertise.includes(category);
      const availabilityMatch = (() => {
        if (availability === 'all') return true;
        const text = tech.availability.toLowerCase();
        if (availability === 'available') return text.includes('available now');
        if (availability === 'soon') return text.includes('min') || text.includes('slot');
        if (availability === 'later') return text.includes('today') || text.includes('next');
        return true;
      })();
      return locationMatch && categoryMatch && availabilityMatch;
    });
  }, [technicians, locationQuery, category, availability]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="location-filter">Location</Label>
          <Input
            id="location-filter"
            placeholder="e.g. Westlands, CBD..."
            value={locationQuery}
            onChange={event => setLocationQuery(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Specialty</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All specialties</SelectItem>
              {expertiseOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Availability</Label>
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger>
              <SelectValue placeholder="All availability" />
            </SelectTrigger>
            <SelectContent>
              {availabilityBuckets.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No technicians match that filter.</p>
        ) : (
          filtered.map(technician => <TechnicianCard key={technician.id} technician={technician} />)
        )}
      </div>
    </div>
  );
}
