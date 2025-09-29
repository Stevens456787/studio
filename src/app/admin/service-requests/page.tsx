import { listServiceRequests } from '@/lib/db';
import { useState } from 'react';

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
function ServiceRequestsTable({ initialRequests }: { initialRequests: any[] }) {
  const [filter, setFilter] = useState('');

  const filtered = initialRequests.filter(req => {
    const q = filter.toLowerCase();
    return (
      req.fullName.toLowerCase().includes(q) ||
      req.phoneNumber.toLowerCase().includes(q) ||
      req.problemDescription.toLowerCase().includes(q)
    );
  });

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
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Phone</th>
              <th className="border px-2 py-1">Address</th>
              <th className="border px-2 py-1">Problem</th>
              <th className="border px-2 py-1">Preferred Date</th>
              <th className="border px-2 py-1">Time Slot</th>
              <th className="border px-2 py-1">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(req => (
              <tr key={req.id}>
                <td className="border px-2 py-1">{req.id}</td>
                <td className="border px-2 py-1">{req.fullName}</td>
                <td className="border px-2 py-1">{req.phoneNumber}</td>
                <td className="border px-2 py-1">{req.address}</td>
                <td className="border px-2 py-1">{req.problemDescription}</td>
                <td className="border px-2 py-1">{req.preferredDate instanceof Date ? req.preferredDate.toISOString().slice(0,10) : String(req.preferredDate)}</td>
                <td className="border px-2 py-1">{req.preferredTimeSlot}</td>
                <td className="border px-2 py-1">{req.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
