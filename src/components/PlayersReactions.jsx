import { usePlayersList } from "playroomkit";

const randomNumBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomRotations = Array(20)
  .fill(0)
  .map(
    () =>
      `rotate(${randomNumBetween(-5, 5)}deg) translateX(${randomNumBetween(
        -10,
        10
      )}px)`
  );

export default function PlayersReactions({ currentEmoji }) {
  const players = usePlayersList();

  return (
    <div className="PlayersReactions">
      <ul className="card-container">
        {currentEmoji.map((emojiData, i) => {
          const player = players.find((p) => p.id === emojiData.id);
          if (!player) return null;
          return (
            <li key={i} className="emoji-display">
              <span
                style={{
                  transform: randomRotations[i % randomRotations.length],
                }}
                className="card"
              >
                <span className="avatar">
                  <img src={player.getProfile().photo} />
                </span>
                {emojiData.emoji}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
