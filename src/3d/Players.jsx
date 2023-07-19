import { createRef, forwardRef, Suspense, useEffect, useState } from "react";
import {
  myPlayer,
  isHost,
  onPlayerJoin,
  getState,
  setState,
} from "playroomkit";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import useGame from "../stores/useGame";

import { randomStartPos } from "../utils/randomPosition";

import {
  AREA_SIZE,
  BOMB_DISTANCE,
  BOMB_INTERVAL,
  BOMB_SPEED,
  MAX_SPEED,
  ROTATION_SPEED,
  VELOCITY,
} from "../utils/constants";

import { smoothAngle } from "../utils/angles";

import { getAnimation } from "../utils/animation";

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
      linearDamping={0.7}
    >
      <CapsuleCollider args={[0.12, 0.3]} />
    </RigidBody>
  );
});

export default function Players({ currentBombsIds, setCurrentBombsIds }) {
  const { clock } = useThree();
  const [players, setPlayers] = useState([]);
  const [bodies, setBodies] = useState([]);
  const [characters, setCharacters] = useState([]);

  const currentControls = useGame((state) => state.currentControls);

  const nipplePos = useGame((state) => state.nipplePos);
  const bombPressed = useGame((state) => state.bombPressed);

  // not safe practice, client could modoify this
  const lastBomb = useGame((state) => state.lastBomb);
  const setLastBomb = useGame((state) => state.setLastBomb);

  const up = useKeyboardControls((state) => state.up);
  const down = useKeyboardControls((state) => state.down);
  const left = useKeyboardControls((state) => state.left);
  const right = useKeyboardControls((state) => state.right);
  const bomb = useKeyboardControls((state) => state.bomb);

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
    if (!currentControls) return;
    if (!nipplePos) return;

    // nipple controls
    if (currentControls === "touch") {
      myPlayer().setState("dir", {
        x: nipplePos?.x || 0,
        z: nipplePos?.y || 0,
      });
    }

    // keyboard controls
    if (currentControls === "keyboard") {
      direction.x = Number(right) - Number(left);
      direction.z = Number(down) - Number(up);
      direction.normalize();
      // update shared direction inputs
      myPlayer().setState("dir", direction);
    }

    // drop bomb
    if (
      (currentControls === "keyboard" && bomb) ||
      (currentControls === "touch" && bombPressed)
    ) {
      // retrieve elapsed time
      const elapsedTime = clock.getElapsedTime();

      // check if enough time has passed
      if (elapsedTime - lastBomb > BOMB_INTERVAL) {
        // send an update to the server
        myPlayer().setState("bomb", true);
        setLastBomb(elapsedTime);
      }
    }

    for (const player of players) {
      const state = player.state;

      // update collider position if is host
      if (isHost()) {
        const bodyRef = player.bodyRef;
        if (!bodyRef?.current) continue;

        const dir = state.getState("dir");
        if (!dir) continue;

        //move rigidbody
        const impulse = {
          x: dir.x * VELOCITY * delta,
          y: 0,
          z: dir.z * VELOCITY * delta,
        };

        const linvel = bodyRef.current.linvel();

        if (Math.abs(linvel.x) >= MAX_SPEED) impulse.x = 0;
        if (Math.abs(linvel.z) >= MAX_SPEED) impulse.z = 0;

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

        const animation = getAnimation(linvel);

        if (playerRef.current?.name !== animation) {
          playerRef.current.name = animation;
          state.setState("anim", animation);
        }

        // rotate the player
        if (dir.x || dir.z) {
          const angle = Math.atan2(dir.x, dir.z);

          // smooth rotation
          const smoothedAngle = smoothAngle(
            playerRef.current.rotation.y,
            angle,
            delta * ROTATION_SPEED
          );

          playerRef.current.rotation.y = smoothedAngle;

          // update shared rotation
          state.setState("rot", angle);
        }

        // drop bomb
        const bombDrop = state.getState("bomb");
        if (bombDrop) {
          state.setState("bomb", false);

          const bombPos = [
            pos.x + dir.x * BOMB_DISTANCE,
            pos.y,
            pos.z + dir.z * BOMB_DISTANCE,
          ];

          const bombRot = [0, 0, 0];
          const bombLinvel = {
            x: linvel.x * BOMB_SPEED,
            y: linvel.y * BOMB_SPEED,
            z: linvel.z * BOMB_SPEED,
          };

          const bombId = state.id + clock.getElapsedTime();
          const bombDropTime = clock.getElapsedTime();

          // update current bomb Ids
          setState(
            bombId,
            {
              id: bombId,
              bombDropTime,
              bombLinvel,
              bombPos,
              bombRot,
              bombDroppedBy: state.id,
            },
            false
          );

          setCurrentBombsIds([...currentBombsIds, bombId]);
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
      {isHost() ? bodies : null}
    </group>
  );
}
