import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center gap-3 text-primary">
      <Link href="/" className="inline-flex">
        <Image
          src="/Davis_&_Shirtliff_official_logo.png"
          alt="Davis & Shirtliff Logo"
          width={170}
          height={170}
        />
      </Link>
      <span className="text-2xl font-bold">FieldAssist</span>
    </div>
  );
}//
