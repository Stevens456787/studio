import Link from 'next/link';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { CircuitBoard } from 'lucide-react';
import QuickTrackForm from './QuickTrackForm';

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Request Service</Link>
          </Button>
          <QuickTrackForm />
          <Button variant="ghost" asChild>
            <Link href="/portal">Customer Portal</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/diagnostics" className="flex items-center gap-2">
              <CircuitBoard className="h-4 w-4" />
              Technician Portal
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
