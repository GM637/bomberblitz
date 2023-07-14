import { useMultiplayerState } from "playroomkit";

import Title from "./Title";
import PlayersList from "./PlayersList";
import EmojiSelector from "./EmojiSelector";

import "./Overlay.css";

export default function Overlay() {
  const [currentEmoji, setCurrentEmoji] = useMultiplayerState("emoji", []);

  return (
    <>
      <Title />
      <PlayersList currentEmoji={currentEmoji} />
      <EmojiSelector
        currentEmoji={currentEmoji}
        setCurrentEmoji={setCurrentEmoji}
      />
    </>
  );
}
