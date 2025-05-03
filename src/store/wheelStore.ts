import { create } from 'zustand';
import { WheelState, SpinResult } from '../types/wheel';

const generateId = () => Math.random().toString(36).substring(2, 9);

// Predefined color schemes
export const COLOR_SCHEMES = {
  default: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
  pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFB3FF', '#B3FFF9'],
  vibrant: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
  neon: ['#FF1493', '#00FF00', '#00BFFF', '#FFD700', '#FF4500', '#9400D3'],
  dark: ['#1F2937', '#374151', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB'],
  ocean: ['#003F5C', '#58508D', '#BC5090', '#FF6361', '#FFA600', '#2EC4B6'],
};

export const useWheelStore = create<WheelState>((set, get) => ({
  names: [
    { id: generateId(), text: 'Alice' },
    { id: generateId(), text: 'Bob' },
    { id: generateId(), text: 'Charlie' },
    { id: generateId(), text: 'David' },
    { id: generateId(), text: 'Eva' },
  ],
  isSpinning: false,
  winner: null,
  config: {
    spinDuration: 5000,
    soundEnabled: true,
    wheelSize: 400,
    colorScheme: 'default',
  },
  history: [],

  addName: (name: string) => {
    if (!name.trim()) return;
    set((state) => ({
      names: [...state.names, { id: generateId(), text: name.trim() }],
    }));
  },

  removeName: (id: string) => {
    set((state) => ({
      names: state.names.filter((name) => name.id !== id),
    }));
  },

  updateName: (id: string, newText: string) => {
    set((state) => ({
      names: state.names.map((name) =>
        name.id === id ? { ...name, text: newText } : name
      ),
    }));
  },

  clearNames: () => {
    set({ names: [] });
  },

  importNames: (namesList: string) => {
    const names = namesList
      .split('\n')
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .map((text) => ({ id: generateId(), text }));
    
    set({ names });
  },

  spin: () => {
    set({ isSpinning: true, winner: null });
  },

  stopSpin: (winnerId: string) => {
    const { names } = get();
    const winner = names.find((name) => name.id === winnerId) || null;
    
    if (winner) {
      const result: SpinResult = {
        id: generateId(),
        name: winner.text,
        timestamp: Date.now(),
      };
      
      set((state) => ({
        isSpinning: false,
        winner,
        history: [result, ...state.history],
      }));
    } else {
      set({ isSpinning: false });
    }
  },

  resetWheel: () => {
    set({ winner: null });
  },

  updateConfig: (config) => {
    set((state) => ({
      config: { ...state.config, ...config },
    }));
  },

  clearHistory: () => {
    set({ history: [] });
  },
}));
