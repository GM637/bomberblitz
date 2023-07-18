import ReactNipple from "react-nipple";
import { radToXZ } from "../utils/angles";

import bomb from "../assets/bomb.png";

export default function TouchControls() {
  return (
    <>
      <Nipple />
      <ActionButtons />
    </>
  );
}

function Nipple() {
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
        onEnd={() => console.log("end")}
        onMove={(_evt, data) => console.log(radToXZ(data.angle.radian))}
      />
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="ActionButtons">
      <button>
        <img src={bomb} alt="bomb" draggable={false} />
      </button>
      <button>
        <img src={bomb} alt="bomb" draggable={false} />
      </button>
    </div>
  );
}
