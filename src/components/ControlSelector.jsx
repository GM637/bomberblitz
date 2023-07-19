import useGame from "../stores/useGame.jsx";

import keyboard from "../assets/keyboard.png";
import touch from "../assets/touch.png";

export default function ControlSelector() {
  const currentControls = useGame((state) => state.currentControls);

  return (
    <div className="ControlSelector">
      <button onClick={useGame((state) => state.switchControls)}>
        {currentControls === "touch" ? (
          <img src={keyboard} alt="touch controls" draggable={false} />
        ) : (
          <img src={touch} alt="keyboard controls" draggable={false} />
        )}
      </button>
    </div>
  );
}
