export default function Stage() {
  return (
    <mesh receiveShadow position={[0, -0.5, 0]}>
      <boxGeometry args={[10, 1, 10]} />
      <meshStandardMaterial attach={"material"} color="hotpink" />
    </mesh>
  );
}
