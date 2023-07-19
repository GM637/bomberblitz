import { PerspectiveCamera } from "@react-three/drei";
import useGame from "../stores/useGame";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Camera() {
  const ref = useRef(null);
  const cameraPosition = useGame((state) => state.cameraPosition);
  const cameraTarget = useGame((state) => state.cameraTarget);

  useFrame((_, delta) => {
    if (!ref.current) return;

    ref.current.position.lerp(cameraPosition, delta * 5);
    ref.current.lookAt(cameraTarget);
  });

  return (
    <PerspectiveCamera
      makeDefault
      fov={50}
      near={0.1}
      far={1000}
      position={[0, 20, 7]}
    />
  );
}
