import Link from 'next/link';
import { notFound } from 'next/navigation';
import { technicians } from '@/data/technicians';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, BriefcaseBusiness, MapPin, Award, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TechnicianProfilePage({ params }: PageProps) {
  const { id } = await params;
  const technician = technicians.find(t => t.id === id);
  if (!technician) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-3xl">{technician.name}</CardTitle>
              <CardDescription>{technician.headline}</CardDescription>
            </div>
            <div className="flex flex-col text-right text-sm text-muted-foreground">
              <span className="flex items-center gap-1 justify-end">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                {technician.rating.toFixed(2)} rating
              </span>
              <span className="flex items-center gap-1 justify-end">
                <BriefcaseBusiness className="h-4 w-4" />
                {technician.jobsCompleted} jobs
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{technician.bio}</p>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Coverage Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {technician.coverageAreas.map(area => (
                  <Badge key={area} variant="secondary">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Certifications
              </h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {technician.certifications.map(cert => (
                  <li key={cert}>{cert}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Recent Jobs</h2>
          <p className="text-muted-foreground">Highlights from the last few weeks.</p>
        </div>
        <div className="space-y-4">
          {technician.recentJobs.map(job => (
            <Card key={job.id} className="border-border/70">
              <CardHeader className="flex flex-col gap-1">
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <CardDescription className="flex flex-wrap gap-4 text-sm">
                  <span>#{job.id}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{new Date(job.date).toLocaleDateString()}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="capitalize">{job.status.replace('_', ' ')}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{job.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return technicians.map(technician => ({ id: technician.id }));
}
