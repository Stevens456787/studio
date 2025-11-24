'use client';

import { useEffect, useState, useTransition } from 'react';
import { getJobsForTechnician } from '@/app/actions/technicians';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, BriefcaseBusiness, Clock, Hash } from 'lucide-react';
import type { JobRecord } from '@/lib/db';

export default function JobList() {
  const [technicianId, setTechnicianId] = useState('');
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const fetchJobs = () => {
    if (!technicianId.trim()) {
      setMessage('Enter your technician ID to view assigned jobs.');
      setJobs([]);
      return;
    }
    startTransition(async () => {
      const result = await getJobsForTechnician(technicianId.trim());
      setJobs(result);
      setMessage(result.length ? null : 'No jobs found for that technician ID.');
    });
  };

  useEffect(() => {
    setMessage('Enter your technician ID to view assigned jobs.');
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>My Jobs</CardTitle>
        <CardDescription>Enter your technician ID to view assigned jobs and statuses.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={technicianId}
            onChange={e => setTechnicianId(e.target.value)}
            placeholder="TECH-xxxx"
          />
          <Button onClick={fetchJobs} disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load Jobs'}
          </Button>
        </div>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        <div className="space-y-3">
          {jobs.map(job => (
            <Card key={job.id} className="border-border/70">
              <CardHeader className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4" />
                  {job.technicianName}
                </CardTitle>
                <CardDescription className="uppercase text-xs">{job.status}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-1">
                    <Hash className="h-3.5 w-3.5" /> {job.id}
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(job.requestedAt).toLocaleString()}
                  </span>
                </div>
                {job.source && <p className="text-xs">Source: {job.source}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
