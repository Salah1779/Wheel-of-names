export interface Name {
  id: string;
  text: string;
  color?: string;
}

export interface WheelConfig {
  spinDuration: number;
  soundEnabled: boolean;
  wheelSize: number;
  colorScheme: string;
}

export interface SpinResult {
  id: string;
  name: string;
  timestamp: number;
}

export interface WheelState {
  names: Name[];
  isSpinning: boolean;
  winner: Name | null;
  config: WheelConfig;
  history: SpinResult[];
  addName: (name: string) => void;
  removeName: (id: string) => void;
  updateName: (id: string, newText: string) => void;
  clearNames: () => void;
  importNames: (namesList: string) => void;
  spin: () => void;
  stopSpin: (winnerId: string) => void;
  resetWheel: () => void;
  updateConfig: (config: Partial<WheelConfig>) => void;
  clearHistory: () => void;
}