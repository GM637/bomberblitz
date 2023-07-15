import Lights from "../environment/Lights";
import Stage from "../3d/Stage";
import LocalCharacter from "../3d/LocalCharacter";

export default function Scene() {
  return (
    <>
      <Lights />
      <Stage />
      <LocalCharacter />
    </>
  );
}
