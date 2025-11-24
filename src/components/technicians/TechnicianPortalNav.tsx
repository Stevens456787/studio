import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutPanelLeft, UserCheck2, ClipboardList, CircuitBoard } from 'lucide-react';

export default function TechnicianPortalNav() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <LayoutPanelLeft className="h-5 w-5 text-primary" />
        <CardTitle className="text-primary text-base">Technician Portal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <Link
          href="/technicians/onboarding"
          className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-primary/5"
        >
          <UserCheck2 className="h-4 w-4 text-primary" />
          Onboarding
        </Link>
        <Link
          href="/technicians/dashboard"
          className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-primary/5"
        >
          <ClipboardList className="h-4 w-4 text-primary" />
          My Jobs Dashboard
        </Link>
        <Link
          href="/admin/diagnostics"
          className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-primary/5"
        >
          <CircuitBoard className="h-4 w-4 text-primary" />
          FixBot (AI)
        </Link>
      </CardContent>
    </Card>
  );
}
