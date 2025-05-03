import React, { useRef, useEffect, useState } from 'react';
import { useWheelStore } from '../store/wheelStore';
import { calculateRotationAngle, calculateSpinEndRotation, getWheelColors } from '../utils/wheelUtils';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

const Wheel: React.FC = () => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
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
          setShowWinnerModal(true);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isSpinning, names, stopSpin, config.spinDuration, config.soundEnabled]);
  
  const handleSpin = () => {
    if (names.length < 2 || isSpinning) return;
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
        className="relative transform transition-transform duration-300 hover:scale-105"
        style={{ 
          width: wheelSize, 
          height: wheelSize, 
          perspective: '1000px',
          filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))'
        }}
        onClick={handleSpin}
      >
        {/* Wheel */}
        <svg
          width={wheelSize}
          height={wheelSize}
          viewBox={`0 0 ${wheelSize} ${wheelSize}`}
          style={{
            transform: `rotate(${rotation}deg) translateZ(20px)`,
            transition: !isSpinning ? 'transform 0.5s ease-out' : 'none',
          }}
          className="absolute transform rotate-3d-0-1-0-10deg"
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
        
        {/* Arrow pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
          <div className="w-8 h-12 relative">
            <div className="absolute inset-x-0 top-0 h-0 w-0 border-l-[16px] border-r-[16px] border-t-[24px] border-l-transparent border-r-transparent border-t-red-600 dark:border-t-red-500 transition-colors duration-200" />
          </div>
        </div>
        
        {/* Center point */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-800 dark:border-gray-300 shadow-lg z-20 transition-colors duration-200 transform translateZ-30px" />
        </div>
        
        {/* Curved Click to Spin label */}
        {!isSpinning && names.length >= 2 && (
          <svg
            width={wheelSize}
            height={wheelSize}
            viewBox={`0 0 ${wheelSize} ${wheelSize}`}
            className="absolute pointer-events-none"
          >
            <path
              id="curve"
              d={`M${centerX - radius * 0.5},${centerY - radius * 0.2} A${radius * 0.5},${radius * 0.5} 0 0 1 ${centerX + radius * 0.5},${centerY - radius * 0.2}`}
              fill="none"
            />
            <text
              className="text-white font-bold"
              fontSize={Math.max(16, radius / 12)}
              fill="currentColor"
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              <textPath
                href="#curve"
                startOffset="50%"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                Click to Spin
              </textPath>
            </text>
          </svg>
        )}
      </div>
      
      {/* Winner Modal */}
      {winner && showWinnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-sm w-full transition-colors duration-300 transform scale-100 animate-scale-in">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="text-yellow-500" size={24} />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Winner!</h3>
              <Sparkles className="text-yellow-500" size={24} />
            </div>
            <p className="text-lg text-center text-gray-600 dark:text-gray-200 mb-4">{winner.text} wins!</p>
            <button
              onClick={() => setShowWinnerModal(false)}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {names.length < 2 && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-1">Add at least 2 names to spin</p>
      )}
      
      <style >{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Wheel;