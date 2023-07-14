import { usePlayersList } from "playroomkit";
import { useMemo } from "react";

const randomNumBetween = (min, max) => {
  Math.floor(Math.random() * (max - min + 1) + min);
};

const randomRotations = Array(20)
  .fill(0)
  .map(
    () =>
      `rotate(${randomNumBetween(-5, 5)}deg) translateX(${randomNumBetween(
        -10,
        10
      )}px)`
  );

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
