'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { CircuitBoard } from 'lucide-react';
import QuickTrackForm from './QuickTrackForm';

export default function Header() {
  const pathname = usePathname();
  const hideNav = pathname.startsWith('/technicians/onboarding') || pathname.startsWith('/technicians/dashboard');

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        {!hideNav && (
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/">Request Service</Link>
            </Button>
            <QuickTrackForm />
            <Button variant="ghost" asChild>
              <Link href="/portal">Customer Portal</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
