"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded || !user) return;
    const role =
      user.publicMetadata?.role || user.unsafeMetadata?.role || "GUARDIAN";
    fetch(`/api/account-data?clerkUserId=${user.id}&role=${role}`)
      .then(async (res) => {
        if (!res.ok)
          throw new Error(
            (await res.json()).error || "Failed to load account data"
          );
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message || "Unknown error"))
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
      {role === "GUARDIAN" && (
        <>
          <h2>Your Players</h2>
          <ul>
            {data.players?.length ? (
              data.players.map((p: any) => (
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
              data.registrations.map((r: any) => (
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
                      (pr: any) =>
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
            Player: {data.player.firstName} {data.player.lastName}
          </h2>
          <div>
            {data.player ? (
              <div>
                {data.player.firstName} {data.player.lastName} (
                {data.player.gender},{" "}
                {new Date(data.player.birthdate).toLocaleDateString()})
              </div>
            ) : (
              <div>No player profile found.</div>
            )}
          </div>
          <h2>Tryout Registrations</h2>
          <ul>
            {data.registrations?.length ? (
              data.registrations.map((r: any) => (
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
