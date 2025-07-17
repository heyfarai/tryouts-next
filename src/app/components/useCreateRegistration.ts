import { useState } from "react";

export function useCreateRegistration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  async function createRegistration({ players, guardianEmail }: { players: any[]; guardianEmail: string }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/create-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ players, guardianEmail }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setRegistrationId(data.registrationId);
      return data.registrationId;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { createRegistration, loading, error, registrationId };
}
