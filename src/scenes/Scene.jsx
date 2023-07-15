import Lights from "../environment/Lights";
import Arena from "../3d/Arena";
import LocalCharacter from "../3d/LocalCharacter";

export default function Scene() {
  return (
    <>
      <Lights />
      <Arena />
      <LocalCharacter />
    </>
  );
}
