import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import DressCard from "@/components/DressCard";
import LeopardBadge from "@/components/LeopardBadge";
import type { Dress } from "@/lib/types";

export const revalidate = 30;

async function getFeatured(): Promise<Dress[]> {
  const { data, error } = await supabaseServer
    .from("dresses")
    .select("*")
    .order("votes", { ascending: false })
    .limit(3);

  if (error || !data) return [];
  return data;
}

async function getTotals() {
  const { data, count } = await supabaseServer
    .from("dresses")
    .select("votes", { count: "exact" });

  const totalVotes = (data ?? []).reduce((sum, d) => sum + (d.votes ?? 0), 0);
  return { totalVotes, totalDresses: count ?? 0 };
}

export default async function HomePage() {
  const [featured, totals] = await Promise.all([getFeatured(), getTotals()]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-14 pt-10 text-center">
        <div className="pointer-events-none absolute -top-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />

        <div className="mb-5 flex justify-center">
          <LeopardBadge className="h-10 w-10" />
        </div>

        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest2 text-gold-400/80">
          The People&rsquo;s Runway
        </p>
        <h1 className="font-display text-5xl font-semibold leading-[1.05] text-gradient-gold sm:text-6xl">
          YAUXAÉ
        </h1>
        <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-bone/70 sm:max-w-sm">
          A house where every silhouette is judged not by critics, but by
          you. Browse the collection. Cast your vote. Crown the look that
          reigns.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/gallery"
            className="w-full max-w-xs rounded-full bg-gold-500 px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-widest text-burgundy-950 shadow-glow transition-transform active:scale-95"
          >
            Enter the Gallery
          </Link>
          <Link
            href="/admin"
            className="text-[11px] uppercase tracking-wider text-bone/40 underline underline-offset-4 hover:text-gold-400"
          >
            Admin dashboard
          </Link>
        </div>

        <div className="mx-auto mt-10 flex max-w-xs justify-center gap-8 border-t border-burgundy-800/60 pt-6">
          <div>
            <p className="font-display text-2xl text-gold-300">
              {totals.totalVotes.toLocaleString()}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-bone/40">
              Votes cast
            </p>
          </div>
          <div>
            <p className="font-display text-2xl text-gold-300">
              {totals.totalDresses}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-bone/40">
              Looks in play
            </p>
          </div>
        </div>
      </section>

      <div className="leopard-rule mx-6" />

      {/* Featured / leaderboard preview */}
      <section className="px-5 py-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl text-ivory">
            Currently in the Lead
          </h2>
          <Link
            href="/gallery"
            className="text-[11px] uppercase tracking-wider text-gold-400 hover:text-gold-300"
          >
            See all →
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {featured.map((dress, i) => (
              <DressCard dress={dress} rank={i + 1} key={dress.id} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-burgundy-800 bg-burgundy-900/50 p-6 text-center text-sm text-bone/50">
            Connect Supabase and run{" "}
            <code className="text-gold-400">supabase/schema.sql</code> to
            populate the gallery.
          </p>
        )}
      </section>

      <div className="leopard-rule mx-6" />

      {/* How it works */}
      <section className="px-6 py-12">
        <h2 className="mb-6 text-center font-display text-xl text-ivory">
          How Voting Works
        </h2>
        <div className="space-y-5">
          {[
            {
              title: "Browse the collection",
              body: "Step into the gallery and view every dress in this season's YAUXAÉ line.",
            },
            {
              title: "Cast one vote per look",
              body: "Tap to vote for your favorite. One vote per look, per visitor.",
            },
            {
              title: "Watch the ranking shift",
              body: "Vote totals update live as the house tallies the crowd's verdict.",
            },
          ].map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-500/50 font-display text-sm text-gold-400">
                {i + 1}
              </span>
              <div>
                <p className="font-display text-base text-ivory">
                  {step.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-bone/60">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
