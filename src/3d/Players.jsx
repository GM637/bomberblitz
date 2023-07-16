import { createRef, forwardRef, Suspense, useEffect, useState } from "react";
import { myPlayer, isHost, onPlayerJoin } from "playroomkit";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";

import { randomStartPos } from "../utils/randomPosition";

import { AREA_SIZE, MOVEMENT_SPEED } from "../utils/constants";

import Character from "./Character";

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

      const startPos = randomStartPos(AREA_SIZE);

      const currCharacter = (
        <SocketPlayer
          key={state.id}
          ref={playerRef}
          position={startPos}
          rotation={[0, 0, 0]}
        />
      );

      let currBody;

      if (isHost()) {
        currBody = (
          <LocalPlayer key={state.id} ref={bodyRef} position={startPos} />
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

      // update collider position if is host
      if (isHost()) {
        const bodyRef = player.bodyRef;
        if (!bodyRef?.current) continue;

        const dir = state.getState("dir");

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

        if (playerPos.x !== pos.x) playerPos.x = pos.x;
        if (playerPos.y !== pos.y) playerPos.y = pos.y;
        if (playerPos.z !== pos.z) playerPos.z = pos.z;

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
          state.setState("rot", angle);
        }
      } else {
        // update character
        const playerRef = player.playerRef;
        if (!playerRef?.current) continue;

        // retrieve shared position
        const pos = state.getState("pos");
        if (!pos) continue;

        const { position } = playerRef.current;

        if (position.x !== pos.x) position.x = pos.x;
        if (position.y !== pos.y) position.y = pos.y;
        if (position.z !== pos.z) position.z = pos.z;

        // retrieve shared rotation
        const rot = state.getState("rot");
        if (rot === undefined) continue;

        playerRef.current.rotation.y = rot;

        // // smooth rotation
        // playerRef.current.rotation.y +=
        //   (rot.y - playerRef.current.rotation.y) * ROT_SPEED * delta;

        // retrieve shared animation
        const animation = state.getState("anim");
        if (!animation) continue;
        if (playerRef.current?.name !== animation) {
          playerRef.current.name = animation;
        }
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
