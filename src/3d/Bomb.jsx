import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { BOMB_SCALE_FACTOR, BOMB_SCALE_SPEED } from "../utils/constants";

const MODEL = "/3d/bomb.glb";

export default function Bomb() {
  const { nodes } = useGLTF(MODEL);
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();

    const newScale =
      1 - BOMB_SCALE_FACTOR * Math.abs(Math.cos(t * BOMB_SCALE_SPEED) ** 2);
    ref.current.scale.x = newScale;
    ref.current.scale.y = newScale;
    ref.current.scale.z = newScale;
  });

  return (
    <group ref={ref} dispose={null}>
      <group name="blockbench_export">
        <group scale={2}>
          <group name="Bomb" position={[0, 0, 0]}>
            <mesh
              name="sphere"
              castShadow
              receiveShadow
              geometry={nodes.sphere.geometry}
              material={nodes.sphere.material}
            />
            <group name="Top" position={[0, 0.156, 0]}>
              <mesh
                name="Thing"
                castShadow
                receiveShadow
                geometry={nodes.Thing.geometry}
                material={nodes.Thing.material}
              />
              <mesh
                name="cylinder"
                castShadow
                receiveShadow
                geometry={nodes.cylinder.geometry}
                material={nodes.cylinder.material}
                rotation={[0, 0, Math.PI / 8]}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL);
