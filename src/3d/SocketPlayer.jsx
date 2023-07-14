import { forwardRef, Suspense, useEffect, useState } from "react";

import Character from "./Character";

const SocketPlayer = forwardRef(({ initialPosition, controls }, ref) => {
  const [currentAnimation, setCurrentAnimation] = useState("Idle");

  useEffect(() => {
    if (controls.isPressed("jump")) {
      console.log("jump");
    }
    if (controls.isPressed("bomb")) {
      console.log("bomb");
    }
  }, [controls]);

  return (
    <group ref={ref} position={initialPosition}>
      <Suspense fallback={null}>
        <Character animation={currentAnimation} />
      </Suspense>
    </group>
  );
});

export default SocketPlayer;
