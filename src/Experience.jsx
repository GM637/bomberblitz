import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Loader } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import AudioComponent from "./components/AudioPlayer";

import Scene from "./scenes/Scene";

import "./Experience.css";

export default function Experience() {

  const audioUrl = 'srcsoundsBomberBG.mp3'

  return (
    <div className="Experience">
      <KeyboardControls
        map={[
          { name: "up", keys: ["ArrowUp"] },
          { name: "down", keys: ["ArrowDown"] },
          { name: "left", keys: ["ArrowLeft"] },
          { name: "right", keys: ["ArrowRight"] },
          { name: "jump", keys: ["Space"] },
          { name: "bomb", keys: ["KeyX"] },
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
          <AudioComponent url={audioUrl} loop volume={0.5} />
        </Canvas>
        <Loader />
      </KeyboardControls>
    </div>
  );
}
