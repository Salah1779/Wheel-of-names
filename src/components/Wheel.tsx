import React, { useRef, useEffect, useState } from 'react';
import { useWheelStore } from '../store/wheelStore';
import { calculateRotationAngle, calculateSpinEndRotation, getWheelColors } from '../utils/wheelUtils';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

const Wheel: React.FC = () => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const { names, isSpinning, spin, stopSpin, winner, config } = useWheelStore();
  
  const spinSound = useRef<HTMLAudioElement | null>(null);
  const successSound = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (config.soundEnabled) {
      spinSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3');
      successSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3');
      
      if (spinSound.current) {
        spinSound.current.loop = true;
      }
    }
    
    return () => {
      if (spinSound.current) {
        spinSound.current.pause();
        spinSound.current = null;
      }
      if (successSound.current) {
        successSound.current.pause();
        successSound.current = null;
      }
    };
  }, [config.soundEnabled]);
  
  useEffect(() => {
    if (isSpinning) {
      if (config.soundEnabled && spinSound.current) {
        spinSound.current.currentTime = 0;
        spinSound.current.play().catch(() => {
          console.log('Audio play was prevented due to browser policy.');
        });
      }
      
      const winnerIndex = Math.floor(Math.random() * names.length);
      const winnerId = names[winnerIndex].id;
      const endRotation = calculateSpinEndRotation(winnerIndex, names.length);
      
      setRotation(0);
      
      let startTime: number | null = null;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        
        const t = Math.min(progress / config.spinDuration, 1);
        const easedT = 1 - Math.pow(1 - t, 3);
        const currentRotation = easedT * endRotation;
        
        setRotation(currentRotation);
        
        if (progress < config.spinDuration) {
          requestAnimationFrame(animate);
        } else {
          if (config.soundEnabled) {
            if (spinSound.current) {
              spinSound.current.pause();
            }
            if (successSound.current) {
              successSound.current.currentTime = 0;
              successSound.current.play().catch(() => {
                console.log('Audio play was prevented due to browser policy.');
              });
            }
          }
          
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          stopSpin(winnerId);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isSpinning, names, stopSpin, config.spinDuration, config.soundEnabled]);
  
  const handleSpin = () => {
    if (names.length < 2) return;
    spin();
  };
  
  const colors = getWheelColors(names, config.colorScheme);
  const wheelSize = config.wheelSize;
  const centerX = wheelSize / 2;
  const centerY = wheelSize / 2;
  const radius = (wheelSize / 2) * 0.95;
  
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div
        ref={wheelRef}
        className="relative"
        style={{ width: wheelSize, height: wheelSize }}
      >
        {/* Wheel */}
        <svg
          width={wheelSize}
          height={wheelSize}
          viewBox={`0 0 ${wheelSize} ${wheelSize}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: !isSpinning ? 'transform 0.5s ease-out' : 'none',
          }}
          className="absolute"
        >
          <g transform={`translate(${centerX}, ${centerY})`}>
            {names.length > 0 ? (
              names.map((name, index) => {
                const startAngle = calculateRotationAngle(index, names.length);
                const endAngle = calculateRotationAngle(index + 1, names.length);
                
                const x1 = Math.cos((startAngle * Math.PI) / 180) * radius;
                const y1 = Math.sin((startAngle * Math.PI) / 180) * radius;
                const x2 = Math.cos((endAngle * Math.PI) / 180) * radius;
                const y2 = Math.sin((endAngle * Math.PI) / 180) * radius;
                
                const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
                
                const pathData = [
                  'M', 0, 0,
                  'L', x1, y1,
                  'A', radius, radius, 0, largeArcFlag, 1, x2, y2,
                  'Z'
                ].join(' ');
                
                const textAngle = (startAngle + (endAngle - startAngle) / 2) * Math.PI / 180;
                const textRadius = radius * 0.65;
                const textX = Math.cos(textAngle) * textRadius;
                const textY = Math.sin(textAngle) * textRadius;
                
                let textRotation = (textAngle * 180 / Math.PI) + 90;
                if (textRotation > 90 && textRotation < 270) {
                  textRotation += 180;
                }
                
                return (
                  <g key={name.id}>
                    <path
                      d={pathData}
                      fill={colors[index % colors.length]}
                      stroke="currentColor"
                      className="text-white dark:text-gray-300"
                      strokeWidth="1"
                    />
                    <text
                      x={textX}
                      y={textY}
                      dy=".3em"
                      textAnchor="middle"
                      className="text-white dark:text-gray-300"
                      fontSize={Math.max(12, radius / 15)}
                      fontWeight="bold"
                      transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                      style={{
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                        pointerEvents: 'none',
                      }}
                    >
                      {name.text.length > 12 ? name.text.substring(0, 10) + '...' : name.text}
                    </text>
                  </g>
                );
              })
            ) : (
              <circle
                r={radius}
                fill="currentColor"
                className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                stroke="currentColor"
                strokeWidth="1"
              />
            )}
          </g>
        </svg>
        
        {/* Arrow pointer - Moved to bottom */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 transform rotate-180">
          <div className="w-8 h-12 relative">
            <div className="absolute inset-x-0 bottom-0 h-0 w-0 border-l-[16px] border-r-[16px] border-b-[24px] border-l-transparent border-r-transparent border-b-red-600 dark:border-b-red-500 transition-colors duration-200" />
          </div>
        </div>
        
        {/* Center point */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-800 dark:border-gray-300 shadow-lg z-20 transition-colors duration-200" />
        </div>
      </div>
      
      {/* Winner announcement */}
      {winner && (
        <div className="mt-4 p-4 rounded-lg bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 flex items-center justify-center space-x-2 animate-fade-in transition-colors duration-200">
          <Sparkles className="text-yellow-500" size={24} />
          <p className="text-xl font-bold text-green-800 dark:text-green-200">{winner.text} wins!</p>
          <Sparkles className="text-yellow-500" size={24} />
        </div>
      )}
      
      {/* Spin button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning || names.length < 2}
        className={`mt-6 px-8 py-3 rounded-full text-lg font-bold transition-colors transform hover:scale-105 
          ${isSpinning 
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white' 
            : names.length < 2 
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
          }`}
      >
        {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
      </button>
      
      {names.length < 2 && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-1">Add at least 2 names to spin</p>
      )}
      
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Wheel;