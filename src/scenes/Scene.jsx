import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import { useMultiplayerState } from "playroomkit/multiplayer.mjs";

import Lights from "../environment/Lights";
import Arena from "../3d/Arena";
import Players from "../3d/Players";
import Bombs from "../3d/Bombs";

export default function Scene() {
  const [curentBombs, setCurrentBombs] = useMultiplayerState("bombs", []);

  return (
    <>
      <Lights />
      <Suspense fallback={null}>
        <Physics debug>
          <Arena />
          <Players setCurrentBombs={setCurrentBombs} />
          <Bombs currentBombs={curentBombs} setCurrentBombs={setCurrentBombs} />
        </Physics>
      </Suspense>
    </>
  );
}
