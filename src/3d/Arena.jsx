import React from "react";
import { useGLTF } from "@react-three/drei";

const MODEL = "/3d/arena.glb";

export default function Model(props) {
  const { nodes } = useGLTF(MODEL);
  return (
    <group {...props} dispose={null} position={[0, -1, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.cylinder.geometry}
        material={nodes.cylinder.material}
      />
    </group>
  );
}

useGLTF.preload(MODEL);
