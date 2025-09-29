import { Wrench } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
      <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
          {/* Add the Davis & Shirtliff logo */}
          <Image
              src="/Davis_&_Shirtliff_official_logo.png" // Path to your logo in the public directory
              alt="Davis & Shirtliff Logo"
              width={170} //Adjust width as needed
              height={170}//Adjust height as needed
          />
      <Wrench className="h-8 w-8" />
      <span className="text-2xl font-bold">FieldAssist</span>
    </Link>
  );
}//