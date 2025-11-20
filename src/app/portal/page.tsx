import CustomerPortal from '@/components/portal/CustomerPortal';

export default function CustomerPortalPage() {
  return (
    <div className="space-y-6">
      <section className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-primary">Track Your Requests</h1>
        <p className="text-muted-foreground">
          Enter the contact details you used when booking to see live status updates and history.
        </p>
      </section>
      <CustomerPortal />
    </div>
  );
}
