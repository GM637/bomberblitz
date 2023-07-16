import Lights from "../environment/Lights";
import Arena from "../3d/Arena";
import Players from "../3d/Players";
import { Suspense } from "react";

import { Physics } from "@react-three/rapier";

export default function Scene() {
  return (
    <>
      <Lights />
      <Suspense fallback={null}>
        <Physics debug>
          <Arena />
          <Players />
        </Physics>
      </Suspense>
    </>
  );
}
