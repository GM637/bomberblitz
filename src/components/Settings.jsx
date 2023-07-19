import ControlSelector from "./ControlSelector";
import CameraPositionSelector from "./CameraPositionSelector";

export default function Settings() {
  return (
    <div className="Settings">
      <ControlSelector />
      <CameraPositionSelector />
    </div>
  );
}
