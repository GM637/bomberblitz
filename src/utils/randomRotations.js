const randomNumBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const randomRotations = Array(20)
  .fill(0)
  .map(
    () =>
      `rotate(${randomNumBetween(-5, 5)}deg) translateX(${randomNumBetween(
        -10,
        10
      )}px)`
  );
