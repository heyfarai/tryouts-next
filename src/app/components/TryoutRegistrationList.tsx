import React from "react";

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthdate: string;
}

interface Payment {
  amount: number;
  currency: string;
  status: string;
  receiptUrl?: string;
}

interface Registration {
  id: string;
  tryoutName: string;
  createdAt: string;
  players: { player: Player }[];
  payment?: Payment | null;
}

export default function TryoutRegistrationList({
  registrations,
  onRegisterAnother,
}: {
  registrations: Registration[];
  onRegisterAnother: () => void;
}) {
  return (
    <div style={{ maxWidth: 700, margin: "64px auto" }}>
      <h2>Your Upcoming Tryout Registrations</h2>
      <ul>
        {registrations.length ? (
          registrations.map((r) => (
            <li
              key={r.id}
              style={{ marginBottom: 16 }}
            >
              <strong>{r.tryoutName}</strong> &mdash; Registered on{" "}
              {new Date(r.createdAt).toLocaleDateString()}
              <br />
              Players:{" "}
              {r.players
                .map((pr) => `${pr.player.firstName} ${pr.player.lastName}`)
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
                    <a
                      href={r.payment.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#1976d2",
                        fontWeight: 600,
                        marginTop: 4,
                        display: "inline-block",
                      }}
                    >
                      View Receipt
                    </a>
                  )}
                </>
              ) : (
                <div style={{ color: "#ff2222" }}>No payment found</div>
              )}
            </li>
          ))
        ) : (
          <li>No tryout registrations found.</li>
        )}
      </ul>
      <button
        onClick={onRegisterAnother}
        style={{
          marginTop: 24,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontWeight: 700,
          fontSize: "1.1rem",
          padding: "12px 32px",
          cursor: "pointer",
        }}
      >
        Register another player
      </button>
    </div>
  );
}
