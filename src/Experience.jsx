import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Scene from "./scenes/Scene";

import "./Experience.css";

export default function Experience() {
  return (
    <div className="Experience">
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
          position: [7, 10, 0],
        }}
        shadows
      >
        <OrbitControls />

        <Scene />
      </Canvas>
    </div>
  );
}
