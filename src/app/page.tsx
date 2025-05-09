import ServiceRequestForm from '@/components/service-request/ServiceRequestForm';
import TechnicianCard from '@/components/service-request/TechnicianCard';
import { Separator } from '@/components/ui/separator';
import { UserCheck } from 'lucide-react';

// Mock data for technicians
const mockTechnicians = [
  { id: '1', name: 'Alice Wonderland', expertise: ['HVAC', 'Plumbing'], rating: 4.8, availability: 'Available Now', avatarUrl: 'https://picsum.photos/seed/alice/400/300' },
  { id: '2', name: 'Bob The Builder', expertise: ['Electrical', 'Appliances'], rating: 4.5, availability: 'Next: Tomorrow AM', avatarUrl: 'https://picsum.photos/seed/bob/400/300' },
  { id: '3', name: 'Carol Danvers', expertise: ['Smart Home', 'Security'], rating: 4.9, availability: 'Available Now', avatarUrl: 'https://picsum.photos/seed/carol/400/300' },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-8 bg-card p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Welcome to FieldAssist</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Need a helping hand? Request a skilled technician for your home or field service needs.
          Fast, reliable, and tracked in real-time.
        </p>
      </section>

      <section id="request-service">
        <h2 className="text-3xl font-semibold mb-6 pb-2 border-b-2 border-primary">Request a Service</h2>
        <div className="bg-card p-6 md:p-8 rounded-lg shadow-lg">
          <ServiceRequestForm />
        </div>
      </section>

      <Separator className="my-12" />

      <section id="available-technicians">
        <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3">
          <UserCheck className="h-8 w-8 text-primary" />
          Our Available Experts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockTechnicians.map(tech => (
            <TechnicianCard key={tech.id} technician={tech} />
          ))}
        </div>
         <p className="mt-6 text-sm text-center text-muted-foreground">
          * Technician availability is illustrative. Actual assignment based on location and specific needs.
        </p>
      </section>
    </div>
  );
}
