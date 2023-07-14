import Lights from "../environment/Lights";
import Stage from "../3d/Stage";
import Players from "../3d/Players";

export default function Scene() {
  return (
    <>
      <Lights />
      <Stage />
      <Players />
    </>
  );
}
