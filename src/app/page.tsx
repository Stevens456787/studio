import ServiceRequestForm from '@/components/service-request/ServiceRequestForm';
import TechnicianCard from '@/components/service-request/TechnicianCard';
import { Separator } from '@/components/ui/separator';
import { UserCheck, ShieldCheck, Clock, Award, HelpCircle, Sparkles, ClipboardList, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Mock data for technicians
const mockTechnicians = [
  { id: '1', name: 'Alice Wonderland', expertise: ['HVAC', 'Plumbing'], rating: 4.8, availability: 'Available Now', avatarUrl: 'https://picsum.photos/seed/alice/400/300' },
  { id: '2', name: 'Bob The Builder', expertise: ['Electrical', 'Appliances'], rating: 4.5, availability: 'Next: Tomorrow AM', avatarUrl: 'https://picsum.photos/seed/bob/400/300' },
  { id: '3', name: 'Carol Danvers', expertise: ['Smart Home', 'Security'], rating: 4.9, availability: 'Available Now', avatarUrl: 'https://picsum.photos/seed/carol/400/300' },
  { id: '4',name: 'Carol Danvers', expertise: ['Smart Home', 'Security'], rating: 4.9, availability: 'Available Now', avatarUrl: 'https://picsum.photos/seed/carol/400/300' },
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

      <Separator className="my-12" />

      <section className="space-y-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">Getting Started</p>
          <h2 className="text-3xl font-bold mt-1">How FieldAssist Works</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Tell us what’s wrong',
              description: 'Share the issue, photos, and budget so we route the best technician.',
              Icon: ClipboardList,
            },
            {
              title: 'Match + live updates',
              description: 'We verify availability, send safety-cleared pros, and track their trip in real time.',
              Icon: Sparkles,
            },
            {
              title: 'Service + follow-up',
              description: 'Your tech finishes the job, collects sign-off, and shares care tips after the visit.',
              Icon: MessageSquare,
            },
          ].map(({ title, description, Icon }) => (
            <Card key={title} className="border-primary/20">
              <CardHeader>
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Safety & Coverage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { Icon: ShieldCheck, label: 'Background-checked technicians' },
              { Icon: Clock, label: 'On-time guarantee with proactive alerts' },
              { Icon: Award, label: 'Fully insured jobs up to $10,000' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-muted-foreground">
                <Icon className="h-5 w-5 text-primary" />
                <span>{label}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              Why homeowners trust us
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-muted-foreground">
            <p>“They arrived within the ETA, solved the issue, and left the work area spotless. I could watch them on the live map the whole time.” — <span className="font-semibold text-foreground">Grace · Westlands</span></p>
            <p>“Submitting photos and budget upfront meant the tech showed up with the exact spare parts I needed.” — <span className="font-semibold text-foreground">Daniel · Kilimani</span></p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">Questions</p>
          <h2 className="text-3xl font-bold mt-1">FAQ</h2>
          <p className="mt-2 text-muted-foreground">Still unsure? Here are the answers we send most often before a booking.</p>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {[
            {
              value: 'coverage',
              question: 'Which areas do you cover?',
              answer:
                'We currently serve Nairobi, Kiambu, and Mombasa counties—expanding every quarter. Enter your address to confirm availability.',
            },
            {
              value: 'pricing',
              question: 'How do you price jobs?',
              answer:
                'You set an estimated budget and our dispatcher confirms final labor + parts before the technician sets off. No surprise fees.',
            },
            {
              value: 'safety',
              question: 'Are technicians vetted?',
              answer:
                'Yes. Every FieldAssist pro passes ID verification, insurance checks, and recurring performance reviews. You can see their profile inside tracking.',
            },
            {
              value: 'reschedule',
              question: 'What if I need to reschedule?',
              answer:
                'Use the link in your confirmation email or reply via your preferred contact method. We’ll notify the assigned technician instantly.',
            },
          ].map(({ value, question, answer }) => (
            <AccordionItem key={value} value={value} className="border rounded-lg px-4">
              <AccordionTrigger className="text-left text-lg font-semibold">{question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
