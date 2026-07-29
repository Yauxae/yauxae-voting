import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-burgundy-800/60 px-5 py-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="font-display text-lg tracking-widest2 text-gold-400">
          YAUXAÉ
        </span>
        <p className="max-w-xs text-xs leading-relaxed text-bone/50">
          A house of the people&rsquo;s vote. Every silhouette rises or falls
          by your applause.
        </p>
        <div className="mt-2 flex gap-5 text-[11px] uppercase tracking-wider text-bone/40">
          <Link href="/gallery" className="hover:text-gold-400">
            Gallery
          </Link>
          <Link href="/admin" className="hover:text-gold-400">
            Admin
          </Link>
        </div>
        <p className="mt-4 text-[10px] text-bone/30">
          © {new Date().getFullYear()} YAUXAÉ. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
