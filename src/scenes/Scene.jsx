import Lights from "../environment/Lights";
import Arena from "../3d/Arena";
import Players from "../3d/Players";

export default function Scene() {
  return (
    <>
      <Lights />
      <Arena />
      <Players />
    </>
  );
}
