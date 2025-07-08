// Player validation logic
import { Player, PlayerErrors } from "./PlayerForm";

export function validatePlayerInfo(players: Player[]): PlayerErrors[] {
  return players.map((player) => ({
    firstName: player.firstName ? "" : "First name required",
    lastName: player.lastName ? "" : "Last name required",
    birthdate: player.birthdate ? "" : "Birthdate required",
    gender: player.gender ? "" : "Gender required",
  }));
}
