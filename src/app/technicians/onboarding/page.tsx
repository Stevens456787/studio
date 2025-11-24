import OnboardingForm from '@/components/technicians/OnboardingForm';

export default function TechnicianOnboardingPage() {
  return (
    <div className="space-y-6">
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">Join FieldAssist</h1>
        <p className="text-muted-foreground">
          Share your specialties, coverage areas, and certifications. We’ll review and activate your profile.
        </p>
      </section>
      <OnboardingForm />
    </div>
  );
}
