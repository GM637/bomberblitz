import { useState } from "react";
import useGame from "../stores/useGame";

import zoomIn from "../assets/zoom_in.png";
import zoomOut from "../assets/zoom_out.png";
import perspective from "../assets/perspective.png";

export default function CameraPositionSelector() {
  const increaseCameraDistance = useGame(
    (state) => state.increaseCameraDistance
  );
  const decreaseCameraDistance = useGame(
    (state) => state.decreaseCameraDistance
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="CameraPositionSelector">
      <button onClick={() => setOpen(!open)}>
        <img src={perspective} alt="camera position" draggable={false} />
      </button>

      <div className={open ? "options visible" : "options hidden"}>
        <button onClick={() => decreaseCameraDistance()}>
          <img src={zoomIn} alt="zoom in" draggable={false} />
        </button>
        <button onClick={() => increaseCameraDistance()}>
          <img src={zoomOut} alt="zoom out" draggable={false} />
        </button>
      </div>
    </div>
  );
}
