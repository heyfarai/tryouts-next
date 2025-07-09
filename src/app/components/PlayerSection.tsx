import React from "react";
import { Player, PlayerErrors } from "./PlayerForm";

interface PlayerSectionProps {
  players: Player[];
  errors: PlayerErrors[];
  onChange: (players: Player[]) => void;
  onErrors: (errors: PlayerErrors[]) => void;
  onAddPlayer: () => void;
  onRemovePlayer: (idx: number) => void;
  expanded: boolean;
  onExpand: () => void;
}

const PlayerSection: React.FC<PlayerSectionProps> = ({
  players,
  errors,
  onChange,
  onAddPlayer,
  onRemovePlayer,
  expanded,
  onExpand,
}) => {
  return (
    <div
      className={`mb-12 ${expanded ? "" : "opacity-60 pointer-events-none"}`}
    >
      <button
        type="button"
        className="w-full text-left py-4 px-2 bg-neutral-900 text-white focus:outline-none flex items-center justify-between"
        onClick={onExpand}
        aria-expanded={expanded}
      >
        <span className="text-xl font-bold">1. Player(s)</span>
        <span className="ml-2">{expanded ? "▼" : "▶"}</span>
      </button>
      {expanded && (
        <>
          {/* Render each player form */}
          {players.map((player, idx) => (
            <div
              key={idx}
              className="mb-6 p-4 border border-gray-800 rounded-md bg-neutral-800"
            >
              <div className="flex gap-4 mb-2">
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={player.firstName}
                    onChange={(e) => {
                      const updated = [...players];
                      updated[idx].firstName = e.target.value;
                      onChange(updated);
                    }}
                    className="w-full px-2 py-2 mb-1 border-gray-900 bg-neutral-900 text-white focus:outline-none"
                  />
                  {errors[idx]?.firstName && (
                    <span className="text-red-500 text-xs">
                      {errors[idx].firstName}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={player.lastName}
                    onChange={(e) => {
                      const updated = [...players];
                      updated[idx].lastName = e.target.value;
                      onChange(updated);
                    }}
                    className="w-full px-2 py-2 mb-1 border-gray-900 bg-neutral-900 text-white focus:outline-none"
                  />
                  {errors[idx]?.lastName && (
                    <span className="text-red-500 text-xs">
                      {errors[idx].lastName}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-4 mb-2">
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1">
                    Birthdate
                  </label>
                  <input
                    type="date"
                    value={player.birthdate}
                    onChange={(e) => {
                      const updated = [...players];
                      updated[idx].birthdate = e.target.value;
                      onChange(updated);
                    }}
                    className="w-full px-2 py-2 mb-1 border-gray-900 bg-neutral-900 text-white focus:outline-none"
                  />
                  {errors[idx]?.birthdate && (
                    <span className="text-red-500 text-xs">
                      {errors[idx].birthdate}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1">Gender</label>
                  <select
                    value={player.gender}
                    onChange={(e) => {
                      const updated = [...players];
                      updated[idx].gender = e.target.value;
                      onChange(updated);
                    }}
                    className="w-full px-2 py-2 mb-1 border-gray-900 bg-neutral-900 text-white focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors[idx]?.gender && (
                    <span className="text-red-500 text-xs">
                      {errors[idx].gender}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-2">
                {players.length > 1 && (
                  <button
                    type="button"
                    className="bg-gray-700 text-white px-3 py-1 rounded"
                    onClick={() => onRemovePlayer(idx)}
                  >
                    Remove
                  </button>
                )}
                {idx === players.length - 1 && (
                  <button
                    type="button"
                    className=" text-white px-3 py-1  ml-auto"
                    onClick={onAddPlayer}
                  >
                    Add Player
                  </button>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default PlayerSection;
