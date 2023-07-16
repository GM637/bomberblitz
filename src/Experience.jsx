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
        ]}
      >
        <Canvas
          camera={{
            fov: 75,
            near: 0.1,
            far: 1000,
            position: [0, 10, 7],
          }}
          shadows
        >
          <Scene />
          <OrbitControls />
        </Canvas>
        <Loader />
      </KeyboardControls>
    </div>
  );
}
