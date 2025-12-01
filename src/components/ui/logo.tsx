import Link from 'next/link';
import { GlassWater } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <GlassWater className="h-7 w-7 text-primary" />
      <span className="text-xl font-headline font-bold text-foreground">
        AquaOrder
      </span>
    </Link>
  );
}