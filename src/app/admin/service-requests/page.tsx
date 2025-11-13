import { listServiceRequests, type ServiceRequestRecord } from '@/lib/db';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';

export default async function ServiceRequestsPage() {
  const requests = await listServiceRequests();

  // Render a client component for filtering
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Service Requests</h1>
      <ServiceRequestsTable initialRequests={requests} />
    </main>
  );
}

// Client component for filtering and displaying requests
function ServiceRequestsTable({ initialRequests }: { initialRequests: ServiceRequestRecord[] }) {
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return initialRequests.filter(req => {
      const inName = req.fullName.toLowerCase().includes(q);
      const inPhone = req.phoneNumber.toLowerCase().includes(q);
      const inProblem = req.problemDescription.toLowerCase().includes(q);
      const inCategories = (req.serviceCategories ?? []).join(' ').toLowerCase().includes(q);
      const inContactMethod = (req.preferredContactMethod ?? '').toLowerCase().includes(q);
      return inName || inPhone || inProblem || inCategories || inContactMethod;
    });
  }, [filter, initialRequests]);

  const formatDate = (value: unknown) => {
    if (!value) return '—';
    try {
      const date = new Date(value as string);
      if (Number.isNaN(date.getTime())) return String(value);
      return date.toLocaleDateString();
    } catch {
      return String(value);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Filter by name, phone, or problem..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-4 px-3 py-2 border rounded w-full max-w-md"
      />
      {filtered.length === 0 ? (
        <p>No service requests found.</p>
      ) : (
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Customer</th>
              <th className="border px-2 py-1">Categories</th>
              <th className="border px-2 py-1">Problem</th>
              <th className="border px-2 py-1">Schedule</th>
              <th className="border px-2 py-1">Contact Pref</th>
              <th className="border px-2 py-1">Budget</th>
              <th className="border px-2 py-1">Attachment</th>
              <th className="border px-2 py-1">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(req => (
              <tr key={req.id}>
                <td className="border px-2 py-1">{req.id}</td>
                <td className="border px-2 py-1">
                  <div className="font-semibold">{req.fullName}</div>
                  <div className="text-xs text-muted-foreground">{req.phoneNumber}</div>
                  <div className="text-xs text-muted-foreground">{req.address}</div>
                </td>
                <td className="border px-2 py-1">
                  <div className="flex flex-wrap gap-1">
                    {(req.serviceCategories ?? []).length === 0 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      req.serviceCategories!.map(category => (
                        <Badge key={category} variant="secondary" className="text-[10px]">
                          {category}
                        </Badge>
                      ))
                    )}
                  </div>
                </td>
                <td className="border px-2 py-1">
                  <div className="text-sm">{req.problemDescription}</div>
                </td>
                <td className="border px-2 py-1 text-xs">
                  <div>{formatDate(req.preferredDate)}</div>
                  <div className="text-muted-foreground">{req.preferredTimeSlot ?? '—'}</div>
                </td>
                <td className="border px-2 py-1">
                  <Badge variant="outline" className="uppercase text-[10px]">
                    {req.preferredContactMethod ?? '—'}
                  </Badge>
                </td>
                <td className="border px-2 py-1">
                  {typeof req.estimatedBudget === 'number'
                    ? `$${req.estimatedBudget.toLocaleString()}`
                    : '—'}
                </td>
                <td className="border px-2 py-1 text-center">
                  {req.mediaDataUri ? (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="mx-auto flex items-center gap-1 text-xs"
                    >
                      <a href={req.mediaDataUri} target="_blank" rel="noopener noreferrer">
                        <Paperclip className="h-3.5 w-3.5" />
                        View
                      </a>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </td>
                <td className="border px-2 py-1 text-xs">{formatDate(req.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
