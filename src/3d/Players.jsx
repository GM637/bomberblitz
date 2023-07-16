import { createRef, forwardRef, Suspense, useEffect, useState } from "react";
import { myPlayer, isHost, onPlayerJoin } from "playroomkit";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";

import Character from "./Character";

const RUN_SPEED = 4;
const MOVEMENT_SPEED = 4;

const SocketPlayer = forwardRef(({ position, rotation }, ref) => {
  const [currentAnimation, setCurrentAnimation] = useState("Idle");

  useFrame(() => {
    if (!ref?.current?.name) return;

    if (currentAnimation !== ref.current.name) {
      setCurrentAnimation(ref.current.name);
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <Suspense fallback={null}>
        <Character animation={currentAnimation} />
      </Suspense>
    </group>
  );
});

const LocalPlayer = forwardRef(({ position }, ref) => {
  return (
    <RigidBody
      ref={ref}
      enabledRotations={[false, false, false]}
      type="dynamic"
      colliders={false}
      position={position}
    >
      <CapsuleCollider args={[0.12, 0.3]} />
    </RigidBody>
  );
});

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [bodies, setBodies] = useState([]);
  const [characters, setCharacters] = useState([]);

  const up = useKeyboardControls((state) => state.up);
  const down = useKeyboardControls((state) => state.down);
  const left = useKeyboardControls((state) => state.left);
  const right = useKeyboardControls((state) => state.right);

  const direction = new THREE.Vector3();

  useEffect(() => {
    onPlayerJoin(async (state) => {
      const playerRef = createRef();
      const bodyRef = createRef();

      const currCharacter = (
        <SocketPlayer
          key={state.id}
          ref={playerRef}
          position={[0, 3, 0]}
          rotation={[0, 0, 0]}
        />
      );

      let currBody;

      if (isHost()) {
        currBody = (
          <LocalPlayer key={state.id} ref={bodyRef} position={[0, 3, 0]} />
        );
      }

      setPlayers((players) => [...players, { state, playerRef, bodyRef }]);
      setCharacters((characters) => [...characters, currCharacter]);
      if (isHost()) setBodies((bodies) => [...bodies, currBody]);

      state.onQuit(() => {
        setCharacters((characters) =>
          characters.filter((p) => p.state.id !== currCharacter.id)
        );
      });
    });
  }, []);

  useFrame((_, delta) => {
    // keyboard controls
    direction.x = Number(right) - Number(left);
    direction.z = Number(down) - Number(up);
    direction.normalize();

    // update shared direction inputs
    myPlayer().setState("dir", direction);

    for (const player of players) {
      const state = player.state;

      const dir = state.getState("dir");

      // update collider position if is host
      if (isHost()) {
        const bodyRef = player.bodyRef;
        if (!bodyRef?.current) continue;

        //move rigidbody
        const impulse = {
          x: dir.x * MOVEMENT_SPEED * delta,
          y: 0,
          z: dir.z * MOVEMENT_SPEED * delta,
        };
        bodyRef.current.applyImpulse(impulse, true);

        // update shared position
        const pos = bodyRef.current.translation();
        state.setState("pos", pos);

        // update character
        const playerRef = player.playerRef;
        if (!playerRef?.current) continue;

        // move the player
        const playerPos = playerRef.current.position;
        if (
          playerPos.x !== pos.x ||
          playerPos.y !== pos.y ||
          playerPos.z !== pos.z
        ) {
          playerRef.current.position.x = pos.x;
          playerRef.current.position.y = pos.y;
          playerRef.current.position.z = pos.z;

          // update shared position
          state.setState("pos", pos);
        }

        // update animation
        const animation = dir.x || dir.z ? "Run" : "Idle";
        if (playerRef.current?.name !== animation) {
          playerRef.current.name = animation;
          state.setState("anim", animation);
        }

        // rotate the player
        if (dir.x || dir.z) {
          const angle = Math.atan2(dir.x, dir.z);
          playerRef.current.rotation.y = angle;

          // update shared rotation
          const rot = playerRef.current.rotation;
          state.setState("rot", rot);
        }
      } else {
        // update character
        const playerRef = player.playerRef;
        if (!playerRef?.current) continue;

        // retrieve shared position
        const pos = state.getState("pos");
        if (!pos) continue;

        playerRef.current.position.x = pos.x;
        playerRef.current.position.y = pos.y;
        playerRef.current.position.z = pos.z;

        // retrieve shared rotation
        const rot = state.getState("rot");
        if (!rot) continue;

        playerRef.current.rotation.y = rot.y;

        // retrieve shared animation
        const animation = state.getState("anim");
        if (!animation) continue;

        playerRef.current.name = animation;
      }
    }
  });

  return (
    <group>
      {characters}
      {bodies}
    </group>
  );
}
