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
          { name: "restaure", keys: ["KeyR"] },
          { name: "reset", keys: ["KeyP"] },
        ]}
      >
        <Canvas
          shadows
          camera={{
            position: [0, 10, 7],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
        >
          <Scene />
          <OrbitControls
            target={[0, 3, 3]}
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
