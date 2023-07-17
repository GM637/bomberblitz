import { Suspense, useEffect } from "react";
import { Physics } from "@react-three/rapier";
import { useMultiplayerState } from "playroomkit";

import Lights from "../environment/Lights";
import Arena from "../3d/Arena";
import Players from "../3d/Players";
import Bombs from "../3d/Bombs";

export default function Scene() {
  const [currentBombs, setCurrentBombs] = useMultiplayerState("bombs", []);

  return (
    <>
      <Lights />
      <Suspense fallback={null}>
        <Physics debug>
          <Arena />
          <Players
            currentBombs={currentBombs}
            setCurrentBombs={setCurrentBombs}
          />
          <Bombs
            currentBombs={currentBombs}
            setCurrentBombs={setCurrentBombs}
          />
        </Physics>
      </Suspense>
    </>
  );
}
