export default function Stage() {
  return (
    <mesh>
      <boxGeometry args={[10, 1, 10]} />
      <meshPhongMaterial color="hotpink" />
    </mesh>
  );
}
