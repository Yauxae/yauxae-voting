"use client";

import { useEffect, useState, useTransition } from "react";
import { supabase } from "@/lib/supabase/client";
import { getVoterFingerprint, hasVotedFor, markVotedFor } from "@/lib/voter";

export default function VoteButton({
  dressId,
  initialVotes,
  size = "md",
}: {
  dressId: string;
  initialVotes: number;
  size?: "sm" | "md" | "lg";
}) {
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setVoted(hasVotedFor(dressId));
  }, [dressId]);

  const handleVote = () => {
    if (voted || isPending) return;
    setError(null);

    // Optimistic update
    setVotes((v) => v + 1);
    setVoted(true);
    markVotedFor(dressId);

    startTransition(async () => {
      const fingerprint = getVoterFingerprint();
      const { data, error: rpcError } = await supabase.rpc("cast_vote", {
        p_dress_id: dressId,
        p_voter_fingerprint: fingerprint,
      });

      if (rpcError) {
        // Roll back optimistic state on failure
        setVotes((v) => Math.max(v - 1, 0));
        setVoted(false);
        setError("Vote couldn't be cast. Try again.");
        window.localStorage.removeItem(`yauxae_voted_${dressId}`);
        return;
      }

      if (data && data[0]?.new_votes != null) {
        setVotes(data[0].new_votes);
      }
    });
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  } as const;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleVote}
        disabled={voted || isPending}
        className={`relative overflow-hidden rounded-full font-semibold uppercase tracking-widest transition-all duration-300 ${sizes[size]} ${
          voted
            ? "cursor-default border border-gold-500/60 bg-burgundy-900 text-gold-400"
            : "bg-gold-500 text-burgundy-950 shadow-glow hover:bg-gold-400 active:scale-95"
        }`}
      >
        {isPending ? "Casting…" : voted ? "Voted ✓" : "Vote for this look"}
      </button>
      <p className="text-xs tracking-wide text-bone/50">
        <span className="font-display text-lg text-gold-300">
          {votes.toLocaleString()}
        </span>{" "}
        votes
      </p>
      {error && <p className="text-[11px] text-burgundy-500">{error}</p>}
    </div>
  );
}
