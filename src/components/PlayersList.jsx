import { usePlayersList } from "playroomkit";
import { useMemo } from "react";

export default function PlayersList() {
  const players = usePlayersList();
  const playersProfiles = useMemo(
    () =>
      players.map((player) => ({
        ...player.getProfile(),
      })),
    [players]
  );

  return (
    <div className="PlayersList">
      <ul className="player-list">
        {playersProfiles.map((player) => (
          <li className="player-profile" key={player.id}>
            <span className="player-avatar">
              <img src={player.photo} />
            </span>
            <span className="player-name">{player.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
