import { useFrame } from "@react-three/fiber";
import { createRef, forwardRef, Suspense, useEffect, useState } from "react";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { getState, isHost, setState } from "playroomkit";

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

export default function Bombs({ currentBombsIds, setCurrentBombsIds }) {
  const [bodies, setBodies] = useState([]);
  const [models, setModels] = useState([]);
  const [bombs, setBombs] = useState([]);

  useEffect(() => {
    // new bomb dropped
    if (bombs.length < currentBombsIds.length) {
      const lastCurrBombId = currentBombsIds[currentBombsIds.length - 1];

      const state = getState(lastCurrBombId);
      if (!state) return;

      if (bombs.length > 0) {
        const lastBomb = bombs[bombs.length - 1];
        if (lastBomb?.id === lastCurrBombId) return;
      }

      const { id, bombPos, bombRot } = state;

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

        setBodies([...bodies, currBody]);
      }

      setModels([...models, currModel]);
      setBombs([...bombs, { id, bodyRef, modelRef, state }]);
    }
    // bomb exploded

  }, [currentBombsIds]);

  useFrame(() => {
    if (!bombs.length) return;

    /*
      // // HOST UPDATE
    */
    if (isHost()) {
      for (const bomb of bombs) {
        const state = getState(bomb.id);

        const bodyRef = bomb.bodyRef;
        if (!bodyRef.current) continue;

        // apply linvel
        if (
          state.bombLinvel.x !== 0 ||
          state.bombLinvel.y !== 0 ||
          state.bombLinvel.z !== 0
        ) {
          bodyRef.current.applyImpulse(state.bombLinvel);

          // reset linvel
          state.bombLinvel = { x: 0, y: 0, z: 0 };
        }

        // update shared position
        const pos = bodyRef.current.translation();
        state.bombPos = pos;

        // update shared rotation
        const rot = bodyRef.current?.rotation();
        state.bombRot = {
          x: rot.x,
          y: rot.y,
          z: rot.z,
        };

        // update shared state
        setState(state.id, state, false);

        // update model
        const modelRef = bomb.modelRef;
        if (!modelRef.current) continue;

        // model position
        modelRef.current.position.x = pos.x;
        modelRef.current.position.y = pos.y;
        modelRef.current.position.z = pos.z;

        // model rotation
        modelRef.current.rotation.x = rot.x;
        modelRef.current.rotation.y = rot.y;
        modelRef.current.rotation.z = rot.z;
      }
    }

    /*
      // // CLIENT UPDATE
    */
    if (!isHost()) {
      for (const bomb of bombs) {
        const id = bomb.id;
        const updatedState = getState(id);

        if (!updatedState) continue;

        // update model position
        const modelRef = bomb.modelRef;

        const pos = updatedState.bombPos;

        modelRef.current.position.x = pos.x;
        modelRef.current.position.y = pos.y;
        modelRef.current.position.z = pos.z;

        // update model rotation
        const rot = updatedState.bombRot;

        modelRef.current.rotation.x = rot.x;
        modelRef.current.rotation.y = rot.y;
        modelRef.current.rotation.z = rot.z;
      }
    }
  });

  return (
    <group>
      {models}
      {isHost() ? bodies : null}
    </group>
  );
}
