import { useFrame } from "@react-three/fiber";
import { createRef, forwardRef, Suspense, useEffect, useState } from "react";
import { RigidBody, BallCollider } from "@react-three/rapier";
import { isHost, useMultiplayerState } from "playroomkit";

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
    <RigidBody ref={ref} colliders={false} position={position} type="dynamic">
      <BallCollider args={[0.4]} />
    </RigidBody>
  );
});

export default function Bombs({ currentBombs, setCurrentBombs }) {
  const [bodies, setBodies] = useState([]);
  const [models, setModels] = useState([]);
  const [bombs, setBombs] = useState([]);
  const [stagedBombs, setStagedBombs] = useMultiplayerState([]);

  useEffect(() => {
    const lastCurrBomb = currentBombs[currentBombs.length - 1];
    if (!lastCurrBomb) return;

    const lastBomb = bombs[bombs.length - 1];

    // console.log("ls: ", lastBomb?.state?.id);
    // console.log("lc: ", lastCurrBomb.id);

    if (lastBomb?.state?.id === lastCurrBomb.id) {
      console.log("same bomb id drop");
      return;
    }

    const { bombDropTime, id, bombLinvel, bombPos, bombRot } = lastCurrBomb;

    const bodyRef = createRef();
    const modelRef = createRef();

    const currModel = (
      <SocketBomb
        key={id + "-model"}
        ref={modelRef}
        position={bombPos}
        rotation={bombRot}
      />
    );

    let currBody;

    if (isHost) {
      currBody = (
        <LocalBomb key={id + "-body"} ref={bodyRef} position={bombPos} />
      );

      setBodies((prev) => [...prev, currBody]);
    }

    setModels((prev) => [...prev, currModel]);
    setBombs((prev) => [...prev, { bodyRef, modelRef, state: lastCurrBomb }]);
  }, [currentBombs]);

  useFrame(() => {
    if (!bombs.length) return;

    if (isHost) {
      let newBombs = [];
      for (const bomb of bombs) {
        const { state } = bomb;

        const bodyRef = bomb.bodyRef;
        if (!bodyRef.current) continue;

        const { bombDropTime, id, bombLinvel, bombPos, bombRot } = state;

        // update shared position
        const pos = bodyRef.current.translation();

        // update shared rotation
        // const rot = bodyRef.current.rotation();

        // store new bomb state
        newBombs.push({
          bombDropTime,
          id,
          bombLinvel,
          bombPos: pos,
          bombRot,
        });

        // update model
        const modelRef = bomb.modelRef;
        if (!modelRef.current) continue;

        ///// ///// ///// ///// ///// ///// ///// ///// console.log("modelRef:", modelRef)

        // model position

        modelRef.current.position.x = pos.x;
        modelRef.current.position.y = pos.y;
        modelRef.current.position.z = pos.z;

        // model rotation
        // modelRef.current.rotation.copy(rot);

        //   } else {
        //     const modelRef = bomb.modelRef;
        //     if (!modelRef.current) continue;

        //     // model position
        //     modelRef.current.position.x = state.bombPos.x;

        //     // model rotation
        //     // modelRef.current.rotation = state.bombRot;
        //   }
      }
      setStagedBombs(() => newBombs);
    } else {
      console.log("trying to update");
      for (let i = 0; i < stagedBombs.length; i++) {
        console.log("bomb update");
        const stagedBomb = stagedBombs[i];

        const modelRef = bombs[i].modelRef || null;
        if (!modelRef.current) continue;

        // model position
        modelRef.current.position.x = stagedBomb.bombPos.x;
        modelRef.current.position.y = stagedBomb.bombPos.y;
        modelRef.current.position.z = stagedBomb.bombPos.z;
      }
    }
  });

  return (
    <group>
      {models}
      {bodies}
    </group>
  );
}
