import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

import Character from "./Character";

const RUN_SPEED = 4;

export default function LocalCharacter() {
  const [_, getKeys] = useKeyboardControls();
  const characterRef = useRef(null);

  const [animation, setAnimation] = useState("Idle");

  const characterDirection = new THREE.Vector3();

  const [characterTarget] = useState(
    () => new THREE.Vector3(0, 0, 0)
  ); 

  const [smoothedCharacterTarget] = useState(
    () => new THREE.Vector3(0, 0, 0)
  );

  useFrame((_, delta) => {
    if (!characterRef?.current) return;

    /*
      ///// Direction Inputs /////
    */

    const { up, down, left, right } = getKeys();

    characterDirection.x = Number(right) - Number(left);
    characterDirection.z = Number(down) - Number(up);

    characterDirection.normalize();

    /*
      ///// Character /////
    */

    // Move the character
    characterRef.current.position.x += characterDirection.x * RUN_SPEED * delta;
    characterRef.current.position.z += characterDirection.z * RUN_SPEED * delta;

    // Rotate the character
    characterTarget.copy(characterRef.current.position);
    characterTarget.x += characterDirection.x;
    characterTarget.z += characterDirection.z;

    smoothedCharacterTarget.lerp(characterTarget, 5 * delta);
    characterRef.current.lookAt(smoothedCharacterTarget);

    // Set the animation
    if (characterDirection.x || characterDirection.z) {
      if (animation !== "Run") setAnimation("Run");
    }

    if (!characterDirection.x && !characterDirection.z) {
      if (animation !== "Idle") setAnimation("Idle");
    }
  });

  return (
    <group ref={characterRef}>
      <Character animation={animation} />;
    </group>
  );
}
