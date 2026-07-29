import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import VoteButton from "@/components/VoteButton";
import DressCard from "@/components/DressCard";
import LeopardBadge from "@/components/LeopardBadge";
import type { Dress } from "@/lib/types";

export const revalidate = 15;

async function getDress(slug: string): Promise<Dress | null> {
  const { data, error } = await supabaseServer
    .from("dresses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

async function getOtherLooks(excludeId: string): Promise<Dress[]> {
  const { data } = await supabaseServer
    .from("dresses")
    .select("*")
    .neq("id", excludeId)
    .order("votes", { ascending: false })
    .limit(4);
  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dress = await getDress(slug);
  if (!dress) return { title: "Look not found — YAUXAÉ" };
  return {
    title: `${dress.name} by ${dress.designer} — YAUXAÉ`,
    description: dress.description,
  };
}

export default async function DressDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dress = await getDress(slug);
  if (!dress) notFound();

  const others = await getOtherLooks(dress.id);

  return (
    <div>
      <div className="px-5 pt-5">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-bone/50 hover:text-gold-400"
        >
          ← Back to gallery
        </Link>
      </div>

      <div className="relative mt-4 aspect-[4/5] w-full overflow-hidden sm:rounded-2xl">
        <Image
          src={dress.image_url}
          alt={`${dress.name} by ${dress.designer}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-burgundy-950/10 to-transparent" />
        <div className="absolute right-4 top-4">
          <LeopardBadge className="h-8 w-8" />
        </div>
        {dress.collection && (
          <span className="absolute left-4 top-4 rounded-full border border-gold-500/50 bg-burgundy-950/60 px-3 py-1 text-[10px] uppercase tracking-wider text-gold-300 backdrop-blur-sm">
            {dress.collection}
          </span>
        )}
      </div>

      <div className="px-6 py-7 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-widest2 text-gold-400/80">
          {dress.designer}
        </p>
        <h1 className="mt-2 font-display text-3xl text-ivory">
          {dress.name}
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-bone/65">
          {dress.description}
        </p>

        <div className="mt-8">
          <VoteButton dressId={dress.id} initialVotes={dress.votes} size="lg" />
        </div>
      </div>

      <div className="leopard-rule mx-6" />

      {others.length > 0 && (
        <section className="px-5 py-10">
          <h2 className="mb-5 font-display text-xl text-ivory">
            More from the House
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {others.map((d) => (
              <DressCard dress={d} key={d.id} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
