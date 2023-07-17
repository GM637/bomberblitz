import { RUN_SPEED, SONIC_SPEED, FIRE_SPEED } from "./constants";

export function getAnimation(linvel) {
  const velocity = Math.abs(linvel.x) + Math.abs(linvel.z);

  if (velocity > SONIC_SPEED) return "SonicRun";
  if (velocity > RUN_SPEED) return "Run";
  if (velocity > FIRE_SPEED) return "FireRun";
  return "Idle";
}
