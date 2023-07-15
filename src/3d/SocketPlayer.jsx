import { forwardRef, Suspense } from "react";

import Character from "./Character";

const SocketPlayer = forwardRef(({ position, rotation, animation }, ref) => {
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <Suspense fallback={null}>
        <Character animation={animation} />
      </Suspense>
    </group>
  );
});

export default SocketPlayer;
