import { Name } from '../types/wheel';
import { COLOR_SCHEMES } from '../store/wheelStore';

// Calculate rotation angle for a specific segment
export const calculateRotationAngle = (index: number, total: number): number => {
  return (index / total) * 360;
};

// Calculate the end rotation for spinning (ensuring multiple full rotations + the winning position)
export const calculateSpinEndRotation = (
  winnerIndex: number, 
  totalNames: number
): number => {
  // Start with at least 5 full rotations (1800 degrees)
  const baseRotation = 1800;
  
  // Calculate the angle to position the winner at the bottom (180 degrees)
  // Since the indicator is now at the bottom of the wheel
  const segmentAngle = 360 / totalNames;
  const winnerAngle = 180 - (winnerIndex * segmentAngle);
  
  // Add a small random offset for natural feel (within the winner's segment)
  const randomOffset = Math.random() * (segmentAngle * 0.8);
  
  return baseRotation + winnerAngle + randomOffset;
};

// Get colors for wheel segments from the selected color scheme
export const getWheelColors = (names: Name[], colorScheme: string): string[] => {
  const schemeColors = COLOR_SCHEMES[colorScheme as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.default;
  
  return names.map((_, index) => schemeColors[index % schemeColors.length]);
};

// Calculate the position for the name text on the wheel
export const calculateTextPosition = (
  index: number,
  total: number,
  radius: number
): { x: number, y: number, rotation: number } => {
  const angle = ((index / total) * 2 * Math.PI) - (Math.PI / 2);
  const textRadius = radius * 0.75; // Position text at 75% of the radius
  
  const x = Math.cos(angle) * textRadius;
  const y = Math.sin(angle) * textRadius;
  
  // Calculate text rotation (perpendicular to the radius)
  let rotation = (angle * 180 / Math.PI) + 90;
  
  // Adjust text rotation so it's always readable (not upside down)
  if (rotation > 90 && rotation < 270) {
    rotation += 180;
  }
  
  return { x, y, rotation };
};

// Format timestamp for history display
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};