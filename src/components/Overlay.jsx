import { useMultiplayerState } from "playroomkit";

import Title from "./Title";
import PlayersList from "./PlayersList";
import EmojiSelector from "./EmojiSelector";
import PlayersReactions from "./PlayersReactions";

import "./Overlay.css";
import { useEffect } from "react";

export default function Overlay() {
  const [currentEmoji, setCurrentEmoji] = useMultiplayerState("emoji", []);

  return (
    <>
      <Title />
      <PlayersList />
      <PlayersReactions currentEmoji={currentEmoji} />
      <EmojiSelector
        currentEmoji={currentEmoji}
        setCurrentEmoji={setCurrentEmoji}
      />
    </>
  );
}
