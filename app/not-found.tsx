import Link from "next/link";
import LeopardBadge from "@/components/LeopardBadge";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <LeopardBadge className="h-10 w-10" />
      <h1 className="mt-5 font-display text-3xl text-ivory">
        This look isn&rsquo;t on the runway
      </h1>
      <p className="mt-3 max-w-xs text-sm text-bone/60">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or the dress has
        been retired from the collection.
      </p>
      <Link
        href="/gallery"
        className="mt-6 rounded-full bg-gold-500 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-burgundy-950"
      >
        Back to gallery
      </Link>
    </div>
  );
}
