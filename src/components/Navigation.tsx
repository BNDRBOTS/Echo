import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NavigationProps {
  items: string[];
  setHoveredItem: (item: string | null) => void;
  handleClick: (item: string) => void;
  transitionProgress: number;
}

export const Navigation: React.FC<NavigationProps> = ({ items, setHoveredItem, handleClick, transitionProgress }) => {
  const groupRef = React.useRef<THREE.Group>(null);
  
  // Calculate positions in a circle around the sphere
  const radius = 3.5;
  const positions = useMemo(() => {
    return items.map((_, i) => {
      const angle = (i / items.length) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.5, Math.sin(angle) * radius * 0.5);
    });
  }, [items]);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow rotation for the entire group
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // If transitioning, fade out / fly away
      if (transitionProgress > 0) {
        groupRef.current.scale.setScalar(1 + transitionProgress * 5);
        // We'll manage opacity via CSS for the HTML elements
      } else {
        groupRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {items.map((item, index) => (
        <Html
          key={item}
          position={positions[index]}
          center
          style={{
            opacity: Math.max(0, 0.7 - transitionProgress * 2),
            transform: `scale(${Math.max(0, 1 - transitionProgress * 2)})`,
          }}
          className="pointer-events-none"
        >
          <div 
            className="group cursor-pointer pointer-events-auto flex flex-col items-center justify-center"
            onPointerEnter={() => setHoveredItem(item)}
            onPointerLeave={() => setHoveredItem(null)}
            onClick={() => handleClick(item)}
          >
            <span className="text-4xl font-extralight tracking-[0.5em] text-white mix-blend-difference group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
              {item}
            </span>
          </div>
        </Html>
      ))}
    </group>
  );
};
