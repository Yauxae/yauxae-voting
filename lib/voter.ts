const STORAGE_KEY = "yauxae_voter_id";

/**
 * Returns a stable, anonymous per-browser identifier used to prevent a
 * single visitor from voting for the same dress more than once. This is
 * intentionally lightweight (no accounts, no login) — it is enforced by a
 * unique constraint on (dress_id, voter_fingerprint) in Supabase, not as a
 * strong anti-fraud measure.
 */
export function getVoterFingerprint(): string {
  if (typeof window === "undefined") return "server";

  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id =
      window.crypto?.randomUUID?.() ??
      `voter-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

export function hasVotedFor(dressId: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(`yauxae_voted_${dressId}`) === "1";
}

export function markVotedFor(dressId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`yauxae_voted_${dressId}`, "1");
}
