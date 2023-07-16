import Lights from "../environment/Lights";
import Arena from "../3d/Arena";
import Players from "../3d/Players";
import { Suspense, useEffect } from "react";

import { Physics } from "@react-three/rapier";
import { useMultiplayerState } from "playroomkit/multiplayer.mjs";

export default function Scene() {
  const [curentBombs, setCurrentBombs] = useMultiplayerState("bombs", []);

  useEffect(() => {
    if (curentBombs.length) {
      console.log("new bomb", curentBombs[curentBombs.length - 1]);
    }
  }, [curentBombs]);

  return (
    <>
      <Lights />
      <Suspense fallback={null}>
        <Physics debug>
          <Arena />
          <Players setCurrentBombs={setCurrentBombs} />
        </Physics>
      </Suspense>
    </>
  );
}
