import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars, Float } from '@react-three/drei';
import { LiquidSphere } from './components/LiquidSphere';
import { Navigation } from './components/Navigation';
import gsap from 'gsap';

const items = ['ABOUT', 'WORK', 'SERVICES', 'CONTACT'];

function App() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [showSection, setShowSection] = useState(false);

  const handleClick = (item: string) => {
    if (clickedItem) return; // Prevent multiple clicks
    setClickedItem(item);
    
    const proxy = { value: 0 };
    gsap.to(proxy, {
      value: 1,
      duration: 2.5,
      ease: "power3.inOut",
      onUpdate: () => {
        setTransitionProgress(proxy.value);
      },
      onComplete: () => {
        setShowSection(true);
      }
    });
  };

  const handleBack = () => {
    setShowSection(false);
    const proxy = { value: 1 };
    gsap.to(proxy, {
      value: 0,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        setTransitionProgress(proxy.value);
      },
      onComplete: () => {
        setClickedItem(null);
      }
    });
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative font-sans">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={['#020202']} />
        <fog attach="fog" args={['#020202', 5, 20]} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#4466ff" />
        
        {/* Environment map for realistic reflections */}
        <Environment preset="city" />

        {/* Stars in the background */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <LiquidSphere
            hoveredItem={hoveredItem}
            clickedItem={clickedItem}
            transitionProgress={transitionProgress}
          />
        </Float>

        <Navigation
          items={items}
          setHoveredItem={setHoveredItem}
          handleClick={handleClick}
          transitionProgress={transitionProgress}
        />
      </Canvas>

      {/* Crosshair / Overlay decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 w-[60vmin] h-[60vmin] rounded-full border border-white mix-blend-overlay"></div>
      
      {/* Title */}
      <div 
        className="absolute top-10 left-10 pointer-events-none uppercase tracking-widest text-xs font-light text-white/50"
      >
        THE ECHO CHAMBER
      </div>

      {/* Section Content (appears after transition) */}
      <div 
        className={`absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-white transition-opacity duration-1000 ${showSection ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <h1 className="text-6xl font-extralight tracking-[0.2em] mb-8">{clickedItem} SECTION</h1>
        <p className="max-w-xl text-center text-white/60 font-light mb-12">
          You have been pulled through the echo chamber. Welcome to the {clickedItem?.toLowerCase()} section. The liquid surface distorted to let you pass, acting as a gateway between dimensions.
        </p>
        <button 
          onClick={handleBack}
          className="px-8 py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors duration-300 tracking-widest text-sm"
        >
          RETURN TO CHAMBER
        </button>
      </div>
    </div>
  );
}

export default App;
