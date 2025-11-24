import Link from 'next/link';
import type { ReactNode } from 'react';
import { ClipboardList, LayoutPanelLeft, UserCheck2 } from 'lucide-react';

export default function TechniciansLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="w-64 bg-white border-r border-border shadow-sm hidden md:flex flex-col">
        <div className="px-6 py-6 flex items-center gap-2 text-primary font-bold uppercase tracking-wide text-sm border-b">
          <LayoutPanelLeft className="h-5 w-5" />
          Technician Portal
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 text-sm">
          <Link
            href="/technicians/onboarding"
            className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/10 text-foreground"
          >
            <UserCheck2 className="h-4 w-4" />
            Onboarding
          </Link>
          <Link
            href="/technicians/dashboard"
            className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/10 text-foreground"
          >
            <ClipboardList className="h-4 w-4" />
            My Jobs Dashboard
          </Link>
        </nav>
      </aside>
      <main className="flex-1 px-4 py-6 md:px-8 lg:px-12">{children}</main>
    </div>
  );
}
