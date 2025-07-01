// Armchair.tsx
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";
import { Center } from "@react-three/drei";

export default function Armchair(props) {
  const groupRef = useRef < THREE.Group > null;
  const { scene } = useGLTF("/armchair.glb");
  const { size, viewport } = useThree();

  const aspect = size.width / viewport.width;

  const bind = useDrag(({ offset: [x, y] }) => {
    if (groupRef.current) {
      groupRef.current.position.x = (x / aspect) * 0.01;
      groupRef.current.position.y = -(y / aspect) * 0.01;
    }
  });

  return (
    <group ref={groupRef} {...props} {...bind()}>
      <Center>
        <primitive object={scene} scale={0.1} />
      </Center>
    </group>
  );
}

useGLTF.preload("/armchair.glb");
