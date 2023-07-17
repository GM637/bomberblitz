export function smoothAngle(curr, target, speed) {
  // Calculate the shortest angle between the target and the current rotation
  let angle = Math.atan2(Math.sin(target - curr), Math.cos(target - curr));
  // Calculate the amount of rotation to apply based on the speed and the angle
  let delta = speed * angle;
  // Apply the delta to the current rotation and return the new rotation
  return curr + delta;
}
