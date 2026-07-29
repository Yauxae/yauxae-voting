import Image from "next/image";
import Link from "next/link";
import type { Dress } from "@/lib/types";
import LeopardBadge from "./LeopardBadge";

export default function DressCard({ dress, rank }: { dress: Dress; rank?: number }) {
  return (
    <Link
      href={`/dress/${dress.slug}`}
      className="group block overflow-hidden rounded-2xl border border-burgundy-800/70 bg-burgundy-900/50 shadow-matte transition-transform duration-300 active:scale-[0.98]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={dress.image_url}
          alt={`${dress.name} by ${dress.designer}`}
          fill
          sizes="(max-width: 640px) 50vw, 300px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/90 via-burgundy-950/10 to-transparent" />

        {rank && (
          <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-burgundy-950/70 font-display text-xs text-gold-300 backdrop-blur-sm">
            {rank}
          </span>
        )}

        <span className="absolute right-3 top-3">
          <LeopardBadge className="h-6 w-6" />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="font-display text-base leading-tight text-ivory">
            {dress.name}
          </p>
          <p className="text-[11px] uppercase tracking-wider text-gold-300/80">
            {dress.designer}
          </p>
          <p className="mt-1 text-[11px] text-bone/60">
            {dress.votes.toLocaleString()} votes
          </p>
        </div>
      </div>
    </Link>
  );
}
