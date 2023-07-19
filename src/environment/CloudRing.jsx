import React, { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import { Vector3 } from 'three';
import * as d3 from 'd3-shape';

const CloudRing = ({ position, radius, width, height, segments }) => {
  const meshRef = useRef();

  // Generate random rotation speed for the cloud ring
  const rotationSpeed = Math.random() * 0.005 + 0.001;

  // Function to create the cloud ring shape using d3
  const createCloudRingShape = () => {
    const cloudGenerator = d3
      .lineRadial()
      .angle((d, i) => (i * 2 * Math.PI) / segments)
      .radius((d, i) => radius + Math.random() * 1.5) // Randomize cloud radius
      .curve(d3.curveBasisClosed);

    const points = Array.from({ length: segments * 2 }, (_, i) => i);
    return cloudGenerator(points);
  };

  // Create the cloud ring shape path
  const cloudRingPath = createCloudRingShape();

  // useFrame allows us to perform animation/render loop updates
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  // Custom mesh for the cloud ring
  const CloudRingMesh = ({ cloudPath }) => {
    return (
      <mesh ref={meshRef} position={position}>
        <geometry attach="geometry">
          <shape>
            <path d={cloudPath} />
          </shape>
        </geometry>
        <meshBasicMaterial attach="material" color="white" transparent opacity={0.3} />
      </mesh>
    );
  };

  return <CloudRingMesh cloudPath={cloudRingPath} />;
};

const Clouds = () => {
  return (
    <group>
      {[...Array(5)].map((_, index) => (
        <CloudRing
          key={index}
          position={[index * 10, 0, 0]} // Customize the position for each cloud ring
          radius={8 + index * 2}
          width={1}
          height={0.5}
          segments={50}
        />
      ))}
    </group>
  );
};

export default Clouds;

