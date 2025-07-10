"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";

interface Registration {
  id: string;
  tryoutName: string;
  createdAt: string;
  payment?: {
    status: string;
    amount: number;
    currency: string;
    receiptUrl?: string;
  };
}

interface DataType {
  role: string;
  players: { id: string; firstName: string; lastName: string; gender: string; birthdate: string }[];
  registrations: (Registration & { players: { player: { firstName: string; lastName: string } }[] })[];
  player?: { firstName: string; lastName: string; gender: string; birthdate: string };
}

export default function AccountPage() {
  const { user, isLoaded } = useUser();

  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isLoaded || !user) return;
    const role =
      user.publicMetadata?.role || user.unsafeMetadata?.role || "GUARDIAN";
    fetch(`/api/account-data?clerkUserId=${user.id}&role=${role}`)
      .then(async (res: Response) => {
        if (!res.ok)
          throw new Error(
            (await res.json()).error || "Failed to load account data"
          );
        return res.json() as Promise<DataType>;
      })
      .then(setData)
      .catch((err: Error) => setError(err.message || "Unknown error"))
      .finally(() => setLoading(false));
  }, [isLoaded, user]);

  if (!isLoaded)
    return <div className="max-w-2xl mx-auto mt-16">Loading...</div>;
  if (!user) return null;
  if (loading)
    return (
      <div className="max-w-2xl mx-auto mt-16">Loading account data...</div>
    );
  if (error) return <div className="max-w-2xl mx-auto mt-16">{error}</div>;

  const role = data?.role;

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <h1>Your Account</h1>
      <div>
        <strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}
      </div>
      {data && role === "GUARDIAN" && (
        <>
          <h2>Your Players</h2>
          <ul>
            {data && data.players && data.players.length ? (
              data.players.map((p: { id: string; firstName: string; lastName: string; gender: string; birthdate: string }) => (
                <li key={p.id}>
                  {p.firstName} {p.lastName} ({p.gender},{" "}
                  {new Date(p.birthdate).toLocaleDateString()})
                </li>
              ))
            ) : (
              <li>No players registered.</li>
            )}
          </ul>
          <h2>Your Tryout Registrations</h2>
          <ul>
            {data.registrations?.length ? (
              data.registrations.map((r: Registration & { players: { player: { firstName: string; lastName: string } }[] }) => (
                <li
                  key={r.id}
                  style={{ marginBottom: 16 }}
                >
                  <strong>{r.tryoutName}</strong> &mdash; Registered on{" "}
                  {new Date(r.createdAt).toLocaleDateString()}
                  <br />
                  Players:{" "}
                  {r.players
                    .map(
                      (pr: { player: { firstName: string; lastName: string } }) =>
                        `${pr.player.firstName} ${pr.player.lastName}`
                    )
                    .join(", ")}
                  <br />
                  {r.payment ? (
                    <>
                      <div>
                        Payment: <b>{r.payment.status}</b> ($
                        {(r.payment.amount / 100).toFixed(2)}{" "}
                        {r.payment.currency.toUpperCase()})
                      </div>
                      {r.payment.receiptUrl && (
                        <div>
                          <a
                            href={r.payment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Receipt
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>No payment found.</div>
                  )}
                </li>
              ))
            ) : (
              <li>No registrations found.</li>
            )}
          </ul>
        </>
      )}
      {role === "PLAYER" && (
        <>
          <h2>
            Player: {data?.player?.firstName} {data?.player?.lastName}
          </h2>
          <div>
            {data?.player && (
              <div>
                {data?.player && `${data.player.firstName} ${data.player.lastName} (${data.player.gender}, ${new Date(data.player.birthdate).toLocaleDateString()})`}
              </div>
            )}
            {!data?.player && (
              <div>No player profile found.</div>
            )}
          </div>
          <h2>Tryout Registrations</h2>
          <ul>
            {data && data.registrations && data.registrations.length ? (
              data.registrations.map((r: Registration & { players: { player: { firstName: string; lastName: string } }[] }) => (
                <li
                  key={r.id}
                  style={{ marginBottom: 16 }}
                >
                  <strong>{r.tryoutName}</strong> &mdash; Registered on{" "}
                  {new Date(r.createdAt).toLocaleDateString()}
                  <br />
                  {r.payment ? (
                    <>
                      <div>
                        Payment: <b>{r.payment.status}</b> ($
                        {(r.payment.amount / 100).toFixed(2)}{" "}
                        {r.payment.currency.toUpperCase()})
                      </div>
                      {r.payment.receiptUrl && (
                        <div>
                          <a
                            href={r.payment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Receipt
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>No payment found.</div>
                  )}
                </li>
              ))
            ) : (
              <li>No registrations found.</li>
            )}
          </ul>
        </>
      )}
      <SignOutButton>
        <button
          type="button"
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium text-nowrap rounded-xl border border-transparent bg-gray-200 text-black hover:bg-gray-300 focus:outline-hidden focus:bg-gray-300 transition disabled:opacity-50 disabled:pointer-events-none"
        >
          Sign out
        </button>
      </SignOutButton>
    </div>
  );
}
