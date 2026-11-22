import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface InventoryItem {
  id: number;
  name: string;
  icon: string;
  rarity: 'legendary' | 'epic' | 'rare' | 'common';
  quantity?: number;
}

export interface InventoryGridProps {
  items?: InventoryItem[];
  selectedSlot?: number;
  className?: string;
}

export const InventoryGrid: React.FC<InventoryGridProps> = ({
  items = [
    { id: 1, name: 'Plasma Rifle', icon: '⚡️', rarity: 'legendary', quantity: 1 },
    { id: 2, name: 'Medkit', icon: '💉', rarity: 'rare', quantity: 4 },
    { id: 3, name: 'EMP Grenade', icon: '💣', rarity: 'epic', quantity: 2 },
    { id: 4, name: 'Cyberdeck Mk.IV', icon: '💾', rarity: 'legendary', quantity: 1 },
    { id: 5, name: 'Shield Booster', icon: '🛡', rarity: 'rare', quantity: 3 },
    { id: 6, name: 'Energy Ammo', icon: '🔋', rarity: 'common', quantity: 240 },
  ],
  selectedSlot = 1,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  const rarityBorders = {
    legendary: 'border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    epic: 'border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.4)]',
    rare: 'border-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.4)]',
    common: 'border-zinc-700',
  };

  return (
    <div
      className={`flex items-center justify-center p-3 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="p-3 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl font-mono"
        style={{
          background: 'rgba(12, 12, 16, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8)',
        }}
      >
        <div className="flex items-center gap-2">
          {items.map((item, idx) => {
            const isSelected = item.id === selectedSlot;
            return (
              <div
                key={item.id}
                className={`relative w-14 h-14 rounded-xl bg-zinc-900/90 border-2 flex flex-col items-center justify-center transition-all ${
                  rarityBorders[item.rarity]
                } ${isSelected ? 'scale-105 ring-2 ring-white/50' : ''}`}
              >
                {/* Hotkey index */}
                <span className="absolute top-1 left-1.5 text-[9px] font-bold text-zinc-500">
                  [{idx + 1}]
                </span>

                {/* Icon */}
                <span className="text-xl">{item.icon}</span>

                {/* Quantity */}
                {item.quantity && item.quantity > 1 && (
                  <span className="absolute bottom-1 right-1.5 text-[10px] font-bold text-white bg-black/60 px-1 rounded">
                    x{item.quantity}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
