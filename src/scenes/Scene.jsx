import Lights from "../environment/Lights";
import Stage from "../3d/Stage";
import Character from "../3d/Character";

export default function Scene() {
  return (
    <>
      <Lights />
      <Stage />
      <Character />
    </>
  );
}
