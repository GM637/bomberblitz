import { createRef, forwardRef, Suspense, useEffect, useState } from "react";
import { myPlayer, onPlayerJoin } from "playroomkit";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import Character from "./Character";

const RUN_SPEED = 4;

const SocketPlayer = forwardRef(({ position, rotation, animation }, ref) => {
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <Suspense fallback={null}>
        <Character animation={animation} />
      </Suspense>
    </group>
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

      const currCharacter = (
        <SocketPlayer
          key={myPlayer().id}
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

    myPlayer().setState("dir", direction);

    for (const player of players) {
      const { ref, state } = player;
      const dir = state.getState("dir");
      const { x, z } = dir;
      ref.current.position.x += x * RUN_SPEED * delta;
      ref.current.position.z += z * RUN_SPEED * delta;
      ref.current.lookAt(
        ref.current.position.x + x,
        ref.current.position.y,
        ref.current.position.z + z
      );
    }
  });

  return <group>{characters}</group>;
}
