import ReactNipple from "react-nipple";
import { radToXY } from "../utils/angles";

import useGame from "../stores/useGame";

import bomb from "../assets/bomb.png";
import jump from "../assets/jump.png";

export default function TouchControls() {
  return (
    <>
      <Nipple />
      <ActionButtons />
    </>
  );
}

function Nipple() {
  const setNipplePos = useGame((state) => state.setNipplePos);
  const resetNipplePos = useGame((state) => state.resetNipplePos);

  return (
    <div className="Nipple">
      <ReactNipple
        options={{ mode: "static", position: { top: "50%", left: "50%" } }}
        style={{
          color: "blue",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
        onEnd={() => resetNipplePos()}
        onMove={(_evt, data) => setNipplePos(radToXY(data.angle.radian))}
      />
    </div>
  );
}

function ActionButtons() {
  const bombPressed = useGame((state) => state.bombPressed);
  const setBombPressed = useGame((state) => state.setBombPressed);
  return (
    <div className="ActionButtons">
      <button
        onMouseUp={() => (bombPressed ? setBombPressed(false) : null)}
        onMouseDown={() => (bombPressed ? null : setBombPressed(true))}
        onTouchStart={() => (bombPressed ? null : setBombPressed(true))}
        onTouchEnd={() => (bombPressed ? setBombPressed(false) : null)}
      >
        <img src={bomb} alt="bomb" draggable={false} />
      </button>
      <button>
        <img src={jump} alt="jump" draggable={false} />
      </button>
    </div>
  );
}
