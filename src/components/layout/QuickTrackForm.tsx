'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function QuickTrackForm() {
  const [requestId, setRequestId] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedId = requestId.trim();

    if (!trimmedId) {
      toast({
        title: 'Enter request ID',
        description: 'Paste the FieldAssist request ID to keep tabs on your technician.',
      });
      return;
    }

    router.push(`/track/${encodeURIComponent(trimmedId)}`);
    setRequestId('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={requestId}
        onChange={(event) => setRequestId(event.target.value)}
        placeholder="Enter request ID"
        aria-label="Enter request ID"
        className="h-9 w-44 lg:w-56"
      />
      <Button type="submit" size="sm" className="gap-1">
        <Search className="h-4 w-4" />
        Track
      </Button>
    </form>
  );
}
