"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Dress } from "@/lib/types";

const SESSION_KEY = "yauxae_admin_authed";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthed(window.sessionStorage.getItem(SESSION_KEY) === "1");
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSCODE;
    if (!expected) {
      setAuthError(
        "No NEXT_PUBLIC_ADMIN_PASSCODE configured — set one in your environment."
      );
      return;
    }
    if (passcode === expected) {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setAuthError(null);
    } else {
      setAuthError("Incorrect passcode.");
    }
  };

  if (!authed) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest2 text-gold-400/80">
          Restricted
        </p>
        <h1 className="mt-2 font-display text-2xl text-ivory">
          Admin Dashboard
        </h1>
        <form
          onSubmit={handleLogin}
          className="mt-6 flex w-full max-w-xs flex-col gap-3"
        >
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode"
            className="rounded-xl border border-burgundy-700 bg-burgundy-900/60 px-4 py-3 text-sm text-ivory outline-none placeholder:text-bone/30 focus:border-gold-500"
          />
          <button
            type="submit"
            className="rounded-full bg-gold-500 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-burgundy-950 active:scale-95"
          >
            Enter
          </button>
          {authError && (
            <p className="text-center text-[11px] text-burgundy-500">
              {authError}
            </p>
          )}
        </form>
        <p className="mt-6 max-w-xs text-center text-[11px] leading-relaxed text-bone/30">
          This lightweight gate is for demo purposes. For production, protect
          this route with Supabase Auth + RLS instead of a shared passcode.
        </p>
      </div>
    );
  }

  return <Dashboard />;
}

function Dashboard() {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("dresses")
      .select("*")
      .order("votes", { ascending: false });
    setDresses(data ?? []);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const totalVotes = useMemo(
    () => dresses.reduce((sum, d) => sum + d.votes, 0),
    [dresses]
  );
  const maxVotes = useMemo(
    () => Math.max(...dresses.map((d) => d.votes), 1),
    [dresses]
  );

  const logout = () => {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  };

  return (
    <div className="px-5 py-8">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest2 text-gold-400/80">
            Admin
          </p>
          <h1 className="mt-1 font-display text-2xl text-ivory">
            Vote Standings
          </h1>
        </div>
        <button
          onClick={logout}
          className="rounded-full border border-burgundy-700 px-3 py-1.5 text-[10px] uppercase tracking-wider text-bone/50 hover:text-gold-400"
        >
          Log out
        </button>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-burgundy-800 bg-burgundy-900/50 p-4">
          <p className="font-display text-2xl text-gold-300">
            {totalVotes.toLocaleString()}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-bone/40">
            Total votes
          </p>
        </div>
        <div className="rounded-2xl border border-burgundy-800 bg-burgundy-900/50 p-4">
          <p className="font-display text-2xl text-gold-300">
            {dresses.length}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-bone/40">
            Looks in play
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-wider text-bone/40">
          {lastUpdated
            ? `Updated ${lastUpdated.toLocaleTimeString()}`
            : "Loading…"}
        </p>
        <button
          onClick={load}
          className="text-[10px] uppercase tracking-wider text-gold-400 hover:text-gold-300"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl border border-burgundy-800/70 bg-burgundy-900/60"
            />
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {dresses.map((d, i) => {
            const pct = totalVotes > 0 ? (d.votes / totalVotes) * 100 : 0;
            const barWidth = (d.votes / maxVotes) * 100;
            return (
              <li
                key={d.id}
                className="relative overflow-hidden rounded-xl border border-burgundy-800 bg-burgundy-900/50 p-3"
              >
                <div
                  className="absolute inset-y-0 left-0 bg-gold-500/10"
                  style={{ width: `${barWidth}%` }}
                />
                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-500/40 font-display text-[11px] text-gold-400">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm text-ivory">{d.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-bone/40">
                        {d.designer}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-base text-gold-300">
                      {d.votes.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-bone/40">
                      {pct.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
