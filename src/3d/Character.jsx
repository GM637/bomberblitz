import { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const MODEL = "/3d/player.glb";

export default function Character(props) {
  const group = useRef();
  const { nodes, animations } = useGLTF(MODEL);
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="blockbench_export">
        <group>
          <group name="Body" position={[0, 0.25, 0]} rotation={[0, 1.562, 0]}>
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
