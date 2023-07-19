import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import { useMultiplayerState } from "playroomkit";

import Lights from "../environment/Lights";
import Arena from "../3d/Arena";
import Players from "../3d/Players";
import Bombs from "../3d/Bombs";

export default function Scene() {
  const [currentBombsIds, setCurrentBombsIds] = useMultiplayerState(
    "bombIds",
    []
  );

  return (
    <>
      <Lights />
      <Suspense fallback={null}>
        <Physics>
          {/* <Physics debug> */}
          <Arena />
          <Players
            currentBombsIds={currentBombsIds}
            setCurrentBombsIds={setCurrentBombsIds}
          />
          <Bombs
            currentBombsIds={currentBombsIds}
            setCurrentBombsIds={setCurrentBombsIds}
          />
        </Physics>
      </Suspense>
    </>
  );
}
