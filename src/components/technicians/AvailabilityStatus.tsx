'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';

// Reserved for future interactive availability toggles; currently unused.
export default function AvailabilityStatus() {
  const [, startTransition] = useTransition();
  return (
    <Button
      variant="outline"
      disabled
      onClick={() => startTransition(() => {})}
    >
      Availability toggle (coming soon)
    </Button>
  );
}
