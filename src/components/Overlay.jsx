import { useMultiplayerState } from "playroomkit";
import useGame from "../stores/useGame";

import Title from "./Title";
import PlayersList from "./PlayersList";
import EmojiSelector from "./EmojiSelector";
import PlayersReactions from "./PlayersReactions";
import TouchControls from "./TouchControls";
import KeyboardControlsInfo from "./Keyboard";

import ControlSelector from "./ControlSelector";

import "./Overlay.css";
import { useEffect } from "react";

export default function Overlay() {
  const [currentEmoji, setCurrentEmoji] = useMultiplayerState("emoji", []);
  const currentControls = useGame((state) => state.currentControls);

  return (
    <>
      {currentControls === "touch" ? <TouchControls /> : null}
      {currentControls === "keyboard" ? <KeyboardControlsInfo /> : null}
      <ControlSelector />
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
