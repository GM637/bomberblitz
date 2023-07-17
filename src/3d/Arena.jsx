import React from "react";
import { useGLTF } from "@react-three/drei";
import { CylinderCollider, RigidBody } from "@react-three/rapier";

const MODEL = "/3d/arena.glb";

export default function Model(props) {
  const { nodes } = useGLTF(MODEL);
  return (
    <RigidBody type="fixed" colliders={false}>
      <group {...props} dispose={null} position={[0, -1, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.cylinder.geometry}
          material={nodes.cylinder.material}
        />
        <CylinderCollider
          args={[1 / 2, 6]}
          position={[0, 0.5, 0]}
          friction={0.7}
          restitution={0.3}
        />
      </group>
    </RigidBody>
  );
}

useGLTF.preload(MODEL);
