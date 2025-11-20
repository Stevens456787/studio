'use client';

import { useState, useTransition } from 'react';
import { lookupCustomerRequests, type CustomerRequestDTO } from '@/app/actions/customer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Search, Clock, Calendar, Phone, MessageSquareWarning } from 'lucide-react';

export default function CustomerPortal() {
  const [contact, setContact] = useState('');
  const [requests, setRequests] = useState<CustomerRequestDTO[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await lookupCustomerRequests({ contact });
      if (result.success) {
        setRequests(result.requests ?? []);
        setMessage(result.requests?.length ? null : 'No requests found for that contact.');
      } else {
        setRequests([]);
        setMessage(result.message ?? 'Unable to fetch requests.');
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Your Requests</CardTitle>
          <CardDescription>Enter the phone number or email you used when booking.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4 md:flex-row" onSubmit={handleSubmit}>
            <Input
              value={contact}
              onChange={event => setContact(event.target.value)}
              placeholder="e.g. +254712345678 or you@example.com"
              required
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Check Status
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}

      <div className="space-y-4">
        {requests.map(request => (
          <Card key={request.id} className="border-border/70">
            <CardHeader className="flex flex-wrap items-center justify-between gap-2">
              <div>
              <CardTitle className="text-lg">Request {request.id}</CardTitle>
                <CardDescription className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(request.createdAt).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {request.phoneNumber}
                  </span>
                </CardDescription>
              </div>
              <Badge variant="outline" className="uppercase tracking-wide">
                {request.status ?? 'pending'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Preferred:{' '}
                  {request.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : 'N/A'} •{' '}
                  {request.preferredTimeSlot ?? 'Any time'}
                </p>
                <Separator className="my-3" />
                <p className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquareWarning className="h-4 w-4" />
                  Issue Summary
                </p>
                <p className="text-muted-foreground text-sm">{request.problemDescription}</p>
              </div>
              {request.serviceCategories?.length ? (
                <div className="flex flex-wrap gap-2 text-xs">
                  {request.serviceCategories.map((category: string) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
