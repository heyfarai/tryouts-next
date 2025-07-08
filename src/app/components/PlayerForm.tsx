import React from "react";

export interface Player {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
}

export interface PlayerErrors {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
}

interface PlayerFormProps {
  players: Player[];
  errors: PlayerErrors[];
  onChange: (players: Player[]) => void;
  onErrors: (errors: PlayerErrors[]) => void;
  onNext: () => void;
  loading: boolean;
}

const PlayerForm: React.FC<PlayerFormProps> = ({
  players,
  errors,
  onChange,
  onErrors,
  onNext,
  loading,
}) => {
  const handleInputChange = (
    idx: number,
    field: keyof Player,
    value: string
  ) => {
    const updatedPlayers = players.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    onChange(updatedPlayers);
  };

  const handleAddPlayer = () => {
    onChange([
      ...players,
      { firstName: "", lastName: "", birthdate: "", gender: "" },
    ]);
    onErrors([
      ...errors,
      { firstName: "", lastName: "", birthdate: "", gender: "" },
    ]);
  };

  const handleRemovePlayer = (idx: number) => {
    const updatedPlayers = players.filter((_, i) => i !== idx);
    const updatedErrors = errors.filter((_, i) => i !== idx);
    onChange(updatedPlayers);
    onErrors(updatedErrors);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="pb-24"
    >
      <h2 className="dela text-2xl font-bold mb-4">Player Information</h2>
      {players.map((player, idx) => (
        <div key={idx}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label
                className="uppercase text-sm font-bold text-gray-300"
                htmlFor={`firstName-${idx}`}
              >
                First Name
              </label>
              <input
                id={`firstName-${idx}`}
                type="text"
                value={player.firstName}
                onChange={(e) =>
                  handleInputChange(idx, "firstName", e.target.value)
                }
                required
                style={{ width: "100%" }}
              />
              {errors[idx]?.firstName && (
                <span style={{ color: "#ff2222" }}>
                  {errors[idx].firstName}
                </span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label
                htmlFor={`lastName-${idx}`}
                className="uppercase text-sm font-bold text-gray-300"
              >
                Last Name
              </label>
              <input
                id={`lastName-${idx}`}
                type="text"
                value={player.lastName}
                onChange={(e) =>
                  handleInputChange(idx, "lastName", e.target.value)
                }
                required
                style={{ width: "100%" }}
              />
              {errors[idx]?.lastName && (
                <span style={{ color: "#ff2222" }}>{errors[idx].lastName}</span>
              )}
            </div>
          </div>
          <div className="flex gap-12 mt-12">
            <div style={{ flex: 1 }}>
              <label
                htmlFor={`birthdate-${idx}`}
                className="uppercase text-sm font-bold text-gray-300"
              >
                Birthdate
              </label>
              <input
                id={`birthdate-${idx}`}
                type="date"
                value={player.birthdate}
                onChange={(e) =>
                  handleInputChange(idx, "birthdate", e.target.value)
                }
                required
                style={{ width: "100%" }}
                max="2012-12-31"
              />
              {errors[idx]?.birthdate && (
                <span style={{ color: "#ff2222" }}>
                  {errors[idx].birthdate}
                </span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor={`gender-${idx}`}>Gender</label>
              <select
                id={`gender-${idx}`}
                value={player.gender}
                onChange={(e) =>
                  handleInputChange(idx, "gender", e.target.value)
                }
                required
                style={{ width: "100%" }}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors[idx]?.gender && (
                <span style={{ color: "#ff2222" }}>{errors[idx].gender}</span>
              )}
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {players.length > 1 && (
              <button
                type="button"
                style={{
                  background: "#444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 16px",
                }}
                onClick={() => handleRemovePlayer(idx)}
              >
                Remove
              </button>
            )}
            {idx === players.length - 1 && (
              <button
                type="button"
                style={{
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 16px",
                  marginLeft: 8,
                }}
                onClick={handleAddPlayer}
              >
                Add another player
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="mt-12">
        <button
          type="submit"
          className="py-3 px-8 border border-gray-300 rounded-sm"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Next"}
        </button>
      </div>
    </form>
  );
};

export default PlayerForm;
