import { myPlayer } from "playroomkit";

export default function EmojiSelector({ currentEmoji, setCurrentEmoji }) {
  return (
    <div className="EmojiSelector">
      <a
        className="emoji-button"
        onClick={() =>
          setCurrentEmoji([...currentEmoji, { emoji: " 🏁 " , id: myPlayer().id }])
        }
      >
        <span role="img">🏁</span>
      </a>
      <a
        className="emoji-button"
        onClick={() =>
          setCurrentEmoji([...currentEmoji, { emoji: "✔️", id: myPlayer().id }])
        }
      >
        <span role="img">✔️</span>
      </a>
      <a
        className="emoji-button"
        onClick={() =>
          setCurrentEmoji([...currentEmoji, { emoji: "👋", id: myPlayer().id }])
        }
      >
        <span role="img">👋</span>
      </a>
      <a
        className="emoji-button"
        onClick={() =>
          setCurrentEmoji([...currentEmoji, { emoji: " 🤣 ", id: myPlayer().id }])
        }
      >
        <span role="img">🤣</span>
      </a>
      <a
        className="emoji-button"
        onClick={() =>
          setCurrentEmoji([...currentEmoji, { emoji: " 💥 ", id: myPlayer().id }])
        }
      >
        <span role="img">💥</span>
      </a>
    </div>
  );
}
