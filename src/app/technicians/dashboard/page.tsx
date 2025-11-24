import JobList from '@/components/technicians/JobList';

export default function TechnicianDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Technician Dashboard</h1>
        <p className="text-muted-foreground">
          Enter your technician ID to view assigned jobs and track your workload.
        </p>
      </section>
      <JobList />
    </div>
  );
}
