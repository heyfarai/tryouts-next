"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Player } from "./page";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CheckInClientProps {
  initialPlayers: Player[];
  onLogout?: () => void;
}

export default function CheckInClient({ initialPlayers, onLogout }: CheckInClientProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"unchecked" | "checked" | "all">(
    "unchecked"
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState<Player | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [addPlayerForm, setAddPlayerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
  });

  useEffect(() => {
    const eventSource = new EventSource("/api/checkin/events");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "checkin_updated") {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => {
            if (player.id === data.playerId) {
              const updatedRegistrations = [...player.registrations];
              if (updatedRegistrations[0]) {
                updatedRegistrations[0] = {
                  ...updatedRegistrations[0],
                  checkedInAt: data.isCheckedIn ? data.timestamp : null,
                  checkedOutAt: !data.isCheckedIn ? data.timestamp : null,
                };
              }
              return { ...player, registrations: updatedRegistrations };
            }
            return player;
          })
        );
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      setError("Lost connection to server. Please refresh.");
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const refreshPlayers = async () => {
    try {
      const response = await fetch("/api/checkin");
      if (!response.ok) throw new Error("Failed to fetch players");
      const data = await response.json();
      const normalizedData = data.map((player: Player) => ({
        ...player,
        registrations: player.registrations || [],
      }));
      setPlayers(normalizedData);
      setError(null);
    } catch (err) {
      setError("Failed to load players. Please try again.");
      console.error("Error fetching players:", err);
    }
  };

  const handleCheckIn = async (
    playerId: string,
    isCheckedIn: boolean,
    retryCount = 0
  ) => {
    const maxRetries = 2;

    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId,
          checkIn: !isCheckedIn,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.details || errorData.error || `HTTP ${response.status}`;
        throw new Error(`API Error: ${errorMessage}`);
      }

      const result = await response.json();

      // Update local state optimistically
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => {
          if (player.id === playerId) {
            const updatedRegistrations = [...player.registrations];
            if (updatedRegistrations[0]) {
              updatedRegistrations[0] = {
                ...updatedRegistrations[0],
                checkedInAt: !isCheckedIn ? new Date().toISOString() : null,
                checkedOutAt: isCheckedIn ? new Date().toISOString() : null,
              };
            }
            return { ...player, registrations: updatedRegistrations };
          }
          return player;
        })
      );

      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error(
        `Error updating check-in status (attempt ${retryCount + 1}):`,
        err
      );

      // Retry logic for network/temporary errors
      if (
        retryCount < maxRetries &&
        err instanceof Error &&
        (err.message.includes("fetch") ||
          err.message.includes("network") ||
          err.message.includes("500"))
      ) {
        console.log(`Retrying check-in for player ${playerId} in 1 second...`);
        setTimeout(() => {
          handleCheckIn(playerId, isCheckedIn, retryCount + 1);
        }, 1000);
        return;
      }

      // Show user-friendly error message
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(
        `Failed to update check-in status: ${errorMessage}. Please try again.`
      );
    }
  };

  const handleButtonClick = (player: Player, isCheckedIn: boolean) => {
    if (isCheckedIn) {
      // Show confirmation modal for checked-in players
      setPlayerToRemove(player);
      setShowConfirmModal(true);
    } else {
      // Direct check-in for unchecked players
      handleCheckIn(player.id, isCheckedIn);
    }
  };

  const confirmRemoval = () => {
    if (playerToRemove) {
      handleCheckIn(playerToRemove.id, true); // true because they're currently checked in
      setShowConfirmModal(false);
      setPlayerToRemove(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/checkin/logout', { method: 'POST' });
      if (onLogout) {
        onLogout();
      } else {
        // Fallback: reload the page to trigger auth check
        window.location.reload();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback: reload the page
      window.location.reload();
    }
  };

  const cancelRemoval = () => {
    setShowConfirmModal(false);
    setPlayerToRemove(null);
  };

  const handleAddPlayer = async () => {
    if (
      !addPlayerForm.firstName ||
      !addPlayerForm.lastName ||
      !addPlayerForm.email ||
      !addPlayerForm.birthdate
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("/api/checkin/add-player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addPlayerForm),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to add player");
      }

      const newPlayer = await response.json();

      // Add the new player to the list and check them in immediately
      setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);

      // Reset form and close modal
      setAddPlayerForm({
        firstName: "",
        lastName: "",
        email: "",
        birthdate: "",
      });
      setShowAddPlayerModal(false);
      setError(null);

      // Auto check-in the new player
      setTimeout(() => {
        handleCheckIn(newPlayer.id, false);
      }, 100);
    } catch (err) {
      console.error("Error adding player:", err);
      setError(err instanceof Error ? err.message : "Failed to add player");
    }
  };

  const cancelAddPlayer = () => {
    setAddPlayerForm({ firstName: "", lastName: "", email: "", birthdate: "" });
    setShowAddPlayerModal(false);
    setError(null);
  };

  const isCheckedIn = (player: Player) => {
    const registration = player.registrations?.[0];
    return !!registration?.checkedInAt && !registration.checkedOutAt;
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      `${player.firstName} ${player.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      player.checkInId?.toString().includes(searchTerm);

    if (!matchesSearch) return false;

    switch (activeTab) {
      case "unchecked":
        return !isCheckedIn(player);
      case "checked":
        return isCheckedIn(player);
      case "all":
      default:
        return true;
    }
  });

  const uncheckedCount = players.filter((p) => !isCheckedIn(p)).length;
  const checkedCount = players.filter(isCheckedIn).length;
  const allCount = players.length;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Image
              src="/precision-logo.svg"
              alt="Precision Heat Logo"
              width={48}
              height={48}
              className="h-12 w-auto mr-2"
            />
            <h1 className="text-2xl font-bold">Tryouts Check-In</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddPlayerModal(true)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Add Player
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
            <button
              onClick={refreshPlayers}
              className="hidden px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => window.print()}
              className="hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors print:hidden"
            >
              Print List
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:text-white focus:bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("unchecked")}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "unchecked"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Unchecked ({uncheckedCount})
          </button>
          <button
            onClick={() => setActiveTab("checked")}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "checked"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Checked In ({checkedCount})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All ({allCount})
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <ul className="divide-y divide-gray-200">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => {
                const checkedIn = isCheckedIn(player);
                return (
                  <li
                    key={player.id}
                    className="px-6 py-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600">
                          {player.checkInId}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {player.firstName} {player.lastName}
                            {!player.registrations?.[0] && (
                              <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                Unpaid
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleButtonClick(player, checkedIn)}
                        onMouseEnter={() => setHoveredButton(player.id)}
                        onMouseLeave={() => setHoveredButton(null)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          checkedIn
                            ? "bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-800"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        }`}
                      >
                        {checkedIn && hoveredButton === player.id
                          ? "Uncheck"
                          : checkedIn
                          ? "Checked In"
                          : "Check In"}
                      </button>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="px-6 py-4 text-center text-gray-500">
                No players found
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && playerToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-500 mb-4">
              Check out {playerToRemove.firstName} {playerToRemove.lastName}{" "}
              from today&apos;s tryouts?
            </h3>
            <p className="text-gray-600 mb-6">
              This will uncheck {playerToRemove.firstName}{" "}
              {playerToRemove.lastName} from the tryouts.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelRemoval}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoval}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Checkout {playerToRemove.firstName}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Walk-in Player Modal */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Walk-in Player
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Add a player who showed up without registration. They&apos;ll be
              marked as unpaid for follow-up.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Player First Name *
                </label>
                <input
                  type="text"
                  value={addPlayerForm.firstName}
                  onChange={(e) =>
                    setAddPlayerForm((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:text-white focus:outline-none focus:ring-2 focus:ring-[var(--precision-red)] focus:border-transparent"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Player Last Name *
                </label>
                <input
                  type="text"
                  value={addPlayerForm.lastName}
                  onChange={(e) =>
                    setAddPlayerForm((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:text-white focus:outline-none focus:ring-2 focus:ring-[var(--precision-red)] focus:border-transparent"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Player Date of Birth *
                </label>
                <DatePicker
                  selected={
                    addPlayerForm.birthdate
                      ? new Date(addPlayerForm.birthdate)
                      : null
                  }
                  onChange={(date: Date | null) =>
                    setAddPlayerForm((prev) => ({
                      ...prev,
                      birthdate: date ? date.toISOString().slice(0, 10) : "",
                    }))
                  }
                  dateFormat="yyyy-MM-dd"
                  maxDate={new Date("2012-12-31")}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  placeholderText="Select player's birthdate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:text-white focus:outline-none focus:ring-2 focus:ring-[var(--precision-red)] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian&apos;s Email *
                </label>
                <input
                  type="email"
                  value={addPlayerForm.email}
                  onChange={(e) =>
                    setAddPlayerForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:text-white focus:outline-none focus:ring-2 focus:ring-[var(--precision-red)] focus:border-transparent"
                  placeholder="Enter guardian's email address"
                />
              </div>

              <p className="text-xs text-gray-500">
                * All fields are required.
              </p>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={cancelAddPlayer}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPlayer}
                className="px-4 py-2 bg-[var(--precision-red)] text-white rounded-md hover:bg-[var(--precision-red)] transition-colors"
              >
                Add & Check In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
