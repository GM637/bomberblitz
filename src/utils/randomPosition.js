export const randomStartPos = (areaSize) => {
  const x = randomIntBewteen(-areaSize, areaSize);
  const y = 0;
  const z = randomIntBewteen(-areaSize, areaSize);

  return [x, y, z];
};

const randomIntBewteen = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};
