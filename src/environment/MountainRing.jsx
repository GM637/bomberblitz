import React, { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import { Vector3 } from 'three';
import * as d3 from 'd3-shape';

const MountainRing = ({ position, radius, width, height, segments }) => {
  const meshRef = useRef();

  // Function to create the mountain ring shape using d3
  const createMountainRingShape = () => {
    const mountainGenerator = d3
      .lineRadial()
      .angle((d, i) => (i * 2 * Math.PI) / segments)
      .radius((d, i) => (i % 2 === 0 ? radius - height : radius))
      .curve(d3.curveBasisClosed);

    const points = Array.from({ length: segments * 2 }, (_, i) => i);
    return mountainGenerator(points);
  };

  // Create the mountain ring shape path
  const mountainRingPath = createMountainRingShape();

  // Custom mesh for the mountain ring
  const MountainRingMesh = ({ mountainPath }) => {
    useFrame(() => {});

    return (
      <mesh ref={meshRef} position={position}>
        <geometry attach="geometry">
          <shape>
            <path d={mountainPath} />
          </shape>
        </geometry>
        <meshBasicMaterial attach="material" color="grey" wireframe />
      </mesh>
    );
  };

  return <MountainRingMesh mountainPath={mountainRingPath} />;
};

export default MountainRing;
