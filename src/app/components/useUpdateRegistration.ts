import { useState } from "react";

export function useUpdateRegistration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateRegistration({ 
    registrationId, 
    players, 
    guardianEmail 
  }: { 
    registrationId: string;
    players: any[]; 
    guardianEmail: string;
  }) {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/update-registration", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId, players, guardianEmail }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      
      const data = await res.json();
      return data.registrationId;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { updateRegistration, loading, error };
}
