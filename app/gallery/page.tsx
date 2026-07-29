"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import DressCard from "@/components/DressCard";
import type { Dress } from "@/lib/types";

type SortKey = "votes" | "name" | "newest";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "votes", label: "Most Voted" },
  { key: "newest", label: "Newest" },
  { key: "name", label: "A – Z" },
];

export default function GalleryPage() {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("votes");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("dresses").select("*");
      if (!active) return;
      if (error) {
        setErrorMsg(
          "Couldn't load the gallery. Check your Supabase configuration."
        );
      } else {
        setDresses(data ?? []);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const sorted = useMemo(() => {
    const copy = [...dresses];
    switch (sort) {
      case "votes":
        return copy.sort((a, b) => b.votes - a.votes);
      case "name":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
        return copy.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return copy;
    }
  }, [dresses, sort]);

  return (
    <div className="px-5 py-8">
      <header className="mb-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-widest2 text-gold-400/80">
          The Collection
        </p>
        <h1 className="mt-2 font-display text-3xl text-ivory">Gallery</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-bone/60">
          Every look competing this season. Vote for as many as you like —
          once each.
        </p>
      </header>

      <div className="mb-6 flex justify-center gap-2">
        {sortOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSort(opt.key)}
            className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
              sort === opt.key
                ? "bg-gold-500 text-burgundy-950"
                : "border border-burgundy-700 text-bone/60 hover:text-gold-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl border border-burgundy-800/70 bg-burgundy-900/60"
            />
          ))}
        </div>
      )}

      {!loading && errorMsg && (
        <p className="rounded-xl border border-burgundy-800 bg-burgundy-900/50 p-6 text-center text-sm text-bone/50">
          {errorMsg}
        </p>
      )}

      {!loading && !errorMsg && sorted.length === 0 && (
        <p className="rounded-xl border border-burgundy-800 bg-burgundy-900/50 p-6 text-center text-sm text-bone/50">
          No dresses yet — run{" "}
          <code className="text-gold-400">supabase/schema.sql</code> to seed
          the gallery.
        </p>
      )}

      {!loading && sorted.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {sorted.map((dress, i) => (
            <DressCard
              dress={dress}
              rank={sort === "votes" ? i + 1 : undefined}
              key={dress.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
