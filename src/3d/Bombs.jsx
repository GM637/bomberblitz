import { useFrame } from "@react-three/fiber";
import { createRef, forwardRef, Suspense, useEffect, useState } from "react";
import { RigidBody, BallCollider } from "@react-three/rapier";
import { isHost } from "playroomkit";

import Bomb from "./Bomb";

const SocketBomb = forwardRef(({ position, rotation }, ref) => {
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <Suspense fallback={null}>
        <Bomb />
      </Suspense>
    </group>
  );
});

const LocalBomb = forwardRef(({ position }, ref) => {
  return (
    <RigidBody ref={ref} colliders={false} position={position}>
      <BallCollider args={[0.4]} />
    </RigidBody>
  );
});

export default function Bombs({ currentBombs, setCurrentBombs }) {
  const [bodies, setBodies] = useState([]);
  const [models, setModels] = useState([]);
  const [bombs, setBombs] = useState([]);

  useEffect(() => {
    const lastCurrBomb = currentBombs[currentBombs.length - 1];
    if (!lastCurrBomb) return;

    const lastBomb = bombs[bombs.length - 1];

    console.log("ls: ", lastBomb?.state?.bombId);
    console.log("lc: ", lastCurrBomb.bombId);

    if (lastBomb?.state?.bombId === lastCurrBomb.bombId) {
      console.log("same bomb id drop");
      return;
    }

    const { bombDropTime, bombId, bombLinvel, bombPos, bombRot } = lastCurrBomb;

    const bodyRef = createRef();
    const modelRef = createRef();

    const currModel = (
      <SocketBomb
        key={bombId + "-model"}
        ref={modelRef}
        position={bombPos}
        rotation={bombRot}
      />
    );

    let currBody;

    if (isHost) {
      currBody = (
        <LocalBomb key={bombId + "-body"} ref={bodyRef} position={bombPos} />
      );

      setBodies((prev) => [...prev, currBody]);
    }

    setModels((prev) => [...prev, currModel]);
    setBombs((prev) => [...prev, { bodyRef, modelRef, state: lastCurrBomb }]);
  }, [currentBombs]);

  useFrame(() => {
    if (!bombs.length) return;

    let newBombs = [];

    for (const bomb of bombs) {
      const { state } = bomb;

      if (isHost) {
        const bodyRef = bomb.bodyRef;
        if (!bodyRef.current) continue;

        const { bombDropTime, bombId, bombLinvel, bombPos, bombRot } = state;

        // update shared position
        const pos = bodyRef.current.translation();

        // update shared rotation
        // const rot = bodyRef.current.rotation();

        // store new bomb state
        newBombs.push({
          bombDropTime,
          bombId,
          bombLinvel,
          bombPos: pos,
          bombRot,
        });

        // update model
        const modelRef = bomb.modelRef;
        if (!modelRef.current) continue;

        ///// ///// ///// ///// ///// ///// ///// ///// console.log("modelRef:", modelRef)

        // model position
        // modelRef.current.position = pos;

        // model rotation
        // modelRef.current.rotation.copy(rot);
      } else {
        const { modelRef } = bomb;
        if (!modelRef.current) continue;

        // model position
        modelRef.current.position = state.bombPos;

        // model rotation
        // modelRef.current.rotation = state.bombRot;
      }
    }

    // share new bomb state
    if (isHost) {
      setCurrentBombs(newBombs);
    }
  });

  return (
    <group>
      {models}
      {bodies}
    </group>
  );
}
