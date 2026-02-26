import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface LiquidSphereProps {
  hoveredItem: string | null;
  clickedItem: string | null;
  transitionProgress: number; // 0 to 1
}

export const LiquidSphere: React.FC<LiquidSphereProps> = ({ hoveredItem, clickedItem, transitionProgress }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  const targetColor = new THREE.Color('#333333');
  const hoverColor = new THREE.Color('#7b2cbf');
  const clickColor = new THREE.Color('#ffffff');

  useFrame((state, delta) => {
    if (!materialRef.current || !meshRef.current) return;

    // Distortion and Speed based on state
    let targetDistort = 0.3;
    let targetSpeed = 1.0;
    let color = targetColor.clone();

    if (clickedItem) {
      targetDistort = 1.2;
      targetSpeed = 4.0;
      color = clickColor.clone();
    } else if (hoveredItem) {
      targetDistort = 0.8;
      targetSpeed = 2.5;
      color = hoverColor.clone();
      
      // Add slightly different behavior per item (dummy logic)
      if (hoveredItem === 'ABOUT') color.set('#4361ee');
      if (hoveredItem === 'WORK') color.set('#f72585');
      if (hoveredItem === 'CONTACT') color.set('#4cc9f0');
    }

    // Smoothly animate material properties
    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, delta * 5);
    materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, delta * 5);
    materialRef.current.color.lerp(color, delta * 5);

    // Handle Implosion scaling
    if (transitionProgress > 0) {
      let scale = 1;
      if (transitionProgress < 0.2) {
        // Shrink phase
        const p = transitionProgress / 0.2;
        scale = 1 - p * 0.5; // Shrinks down to 0.5
      } else {
        // Explode / Pass through phase
        const p = (transitionProgress - 0.2) / 0.8;
        // Ease In Expo for dramatic effect
        const easeInExpo = p === 0 ? 0 : Math.pow(2, 10 * p - 10);
        scale = 0.5 + easeInExpo * 50; // Scales up to cover screen
      }
      meshRef.current.scale.setScalar(scale);
    } else {
      // Normal breathing scale
      const breath = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(1 + breath);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 128, 128]} />
      <MeshDistortMaterial
        ref={materialRef}
        color="#333333"
        envMapIntensity={2.0}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        metalness={0.9}
        roughness={0.1}
        distort={0.3}
        speed={1}
      />
    </mesh>
  );
};
