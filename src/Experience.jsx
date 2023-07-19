import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Loader } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";

import Scene from "./scenes/Scene";

import "./Experience.css";

export default function Experience() {
  return (
    <div className="Experience">
      <KeyboardControls
        map={[
          { name: "up", keys: ["ArrowUp"] },
          { name: "down", keys: ["ArrowDown"] },
          { name: "left", keys: ["ArrowLeft"] },
          { name: "right", keys: ["ArrowRight"] },
          { name: "jump", keys: ["KeyX"] },
          { name: "bomb", keys: ["KeyC"] },
        ]}
      >
        <Canvas
          shadows
          camera={{
            position: [0, 15, 15],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}

        >
          <Scene />
          <OrbitControls
            target={[0, 4, 3]}
            enablePan={false}
            enableZoom={true}
            enableRotate={false}
          />
        </Canvas>
        <Loader />
      </KeyboardControls>
    </div>
  );
}
