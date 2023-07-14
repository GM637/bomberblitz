import { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MODEL = "/3d/player.glb";

const MAX_SPEED = 3;

export default function Character(props) {
  const characterRef = useRef(null);
  const { nodes, animations } = useGLTF(MODEL);
  const { actions, names } = useAnimations(animations, characterRef);
  const [_subscribedKeys, getKeys] = useKeyboardControls();

  const [isWalking, setIsWalking] = useState(false);

  const direction = new THREE.Vector3(0, 0, 0);
  const pointer = new THREE.Vector3(0, 0, 0);
  const lookVec = new THREE.Vector3(1, 0, 0);

  useFrame((_state, delta) => {
    if (characterRef?.current === undefined) return;

    const { current: character } = characterRef;

    // reset direction
    direction.x = 0;
    direction.z = 0;

    // update input
    const { up, down, left, right, jump } = getKeys();

    if (up) direction.x -= 1;
    if (down) direction.x += 1;
    if (left) direction.z += 1;
    if (right) direction.z -= 1;

    // normalize direction
    direction.normalize();

    // update position
    character.position.x += direction.x * MAX_SPEED * delta;
    character.position.z += direction.z * MAX_SPEED * delta;

    // update rotation
    pointer.copy(character.position);
    character.lookAt(pointer);

    // update animations
    if (direction.length() > 0.01 && !isWalking) setIsWalking(true);
    if (direction.length() <= 0.01 && isWalking) setIsWalking(false);
  });

  const getCurrentMove = () => {
    /*
      
    */
    if (isWalking) return names[1];
    return names[0];
  };

  useEffect(() => {
    const animation = getCurrentMove();

    actions[animation].reset().fadeIn(0.5).play();
    return () => actions[animation].fadeOut(0.5);
  }, [isWalking]);

  return (
    <group ref={characterRef} {...props} dispose={null}>
      <group name="blockbench_export">
        <group>
          <group name="Body" position={[0, 0.25, 0]}>
            <group name="Legs2" />
            <group name="Head" position={[0, 0.125, 0]}>
              <mesh
                name="Head_1"
                castShadow
                receiveShadow
                geometry={nodes.Head_1.geometry}
                material={nodes.Head_1.material}
                position={[0, -0.375, 0]}
              />
              <mesh
                name="Eyebrow"
                castShadow
                receiveShadow
                geometry={nodes.Eyebrow.geometry}
                material={nodes.Eyebrow.material}
              />
            </group>
            <group name="Chest">
              <group name="Right2">
                <mesh
                  name="Hand"
                  castShadow
                  receiveShadow
                  geometry={nodes.Hand.geometry}
                  material={nodes.Hand.material}
                />
              </group>
              <group name="Left2">
                <mesh
                  name="Hand_1"
                  castShadow
                  receiveShadow
                  geometry={nodes.Hand_1.geometry}
                  material={nodes.Hand_1.material}
                />
              </group>
            </group>
            <group name="Legs">
              <group name="Right">
                <mesh
                  name="Feet"
                  castShadow
                  receiveShadow
                  geometry={nodes.Feet.geometry}
                  material={nodes.Feet.material}
                />
              </group>
              <group name="Left">
                <mesh
                  name="Feet_1"
                  castShadow
                  receiveShadow
                  geometry={nodes.Feet_1.geometry}
                  material={nodes.Feet_1.material}
                />
              </group>
            </group>
            <group name="Body2" position={[0, 0.125, 0]}>
              <mesh
                name="Body_1"
                castShadow
                receiveShadow
                geometry={nodes.Body_1.geometry}
                material={nodes.Body_1.material}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL);
