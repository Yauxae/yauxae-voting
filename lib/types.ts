export type Dress = {
  id: string;
  slug: string;
  name: string;
  designer: string;
  collection: string | null;
  description: string;
  image_url: string;
  votes: number;
  created_at: string;
};

export type Vote = {
  id: string;
  dress_id: string;
  voter_fingerprint: string;
  created_at: string;
};

// Minimal typed schema shape for the Supabase client generic.
// Regenerate with `supabase gen types typescript` once the project is linked
// for full type safety.
export type Database = {
  public: {
    Tables: {
      dresses: {
        Row: Dress;
        Insert: Partial<Dress> & { name: string; image_url: string };
        Update: Partial<Dress>;
      };
      votes: {
        Row: Vote;
        Insert: Partial<Vote> & { dress_id: string; voter_fingerprint: string };
        Update: Partial<Vote>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      cast_vote: {
        Args: { p_dress_id: string; p_voter_fingerprint: string };
        Returns: { new_votes: number }[];
      };
    };
  };
};
