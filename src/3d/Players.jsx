import { createRef, forwardRef, Suspense, useEffect, useState } from "react";
import { myPlayer, isHost, onPlayerJoin } from "playroomkit";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";

import Character from "./Character";

const RUN_SPEED = 4;
const MOVEMENT_SPEED = 4;

const SocketPlayer = forwardRef(({ position, rotation, animation }, ref) => {
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <Suspense fallback={null}>
        <Character animation={animation} />
      </Suspense>
    </group>
  );
});

const LocalPlayer = forwardRef(({ position, rotation, animation }, ref) => {
  return (
    <RigidBody
      ref={ref}
      enabledRotations={[false, false, false]}
      type="dynamic"
      colliders={false}
      position={position}
    >
      <CapsuleCollider args={[0.12, 0.3]} />
      <Suspense fallback={null}>
        <Character animation={animation} />
      </Suspense>
    </RigidBody>
  );
});

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [characters, setCharacters] = useState([]);

  const up = useKeyboardControls((state) => state.up);
  const down = useKeyboardControls((state) => state.down);
  const left = useKeyboardControls((state) => state.left);
  const right = useKeyboardControls((state) => state.right);

  const direction = new THREE.Vector3();

  useEffect(() => {
    onPlayerJoin(async (state) => {
      const ref = createRef();

      const currCharacter = isHost() ? (
        <LocalPlayer
          key={state.id}
          ref={ref}
          position={[0, 3, 0]}
          rotation={[0, 0, 0]}
          animation={"Idle"}
        />
      ) : (
        <SocketPlayer
          key={state.id}
          ref={ref}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          animation={"Idle"}
        />
      );

      setPlayers((players) => [...players, { state, ref }]);
      setCharacters((characters) => [...characters, currCharacter]);

      state.onQuit(() => {
        setCharacters((characters) =>
          characters.filter((p) => p.state.id !== currCharacter.id)
        );
      });
    });
  }, []);

  useFrame((_, delta) => {
    direction.x = Number(right) - Number(left);
    direction.z = Number(down) - Number(up);
    direction.normalize();

    // update shared direction inputs
    myPlayer().setState("dir", direction);

    if (isHost()) {
      for (const player of players) {
        const { ref, state } = player;
        if (!ref.current) continue;

        const dir = state.getState("dir");

        //move rigidbody
        const impulse = { x: dir.x * MOVEMENT_SPEED * delta, y: 0, z: dir.z * MOVEMENT_SPEED * delta }
        ref.current.applyImpulse(impulse, true);

        // update shared position
        // const pos = ref.current.getWorldPos();

        // console.log(pos); ///// ///// ///// ///// ///// /////CONSOLE

        // state.setState("pos", pos);
      }
    } else {
      for (const player of players) {
        const { ref, state } = player;
        if (!ref?.current) continue;

        // retrieve shared position
        const pos = state.getState("pos");
        if (!pos) continue;

        ref.current.position.x = pos.x;
        ref.current.position.y = pos.y;
        ref.current.position.z = pos.z;
      }
    }
  });

  return <group>{characters}</group>;
}
