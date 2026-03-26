import React from 'react';
import { Entity } from '@/hooks/useGameEngine';

interface Props {
  nearbyLoot: Entity[];
  onTake: (entityId: string) => void;
}

export default function LootStream({ nearbyLoot, onTake }: Props) {
  if (!nearbyLoot || nearbyLoot.length === 0) return null;

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-[40] w-64 pointer-events-none">
      <div className="font-display text-[#00ff88] text-xs tracking-widest text-right mb-1 select-none opacity-80 animate-pulse drop-shadow-[0_0_5px_#00ff88]">NEARBY LOOT DETECTED</div>
      {nearbyLoot.map((loot) => {
        const wep = loot.equippedWeapon;
        if (!wep) return null;
        return (
          <div key={loot.id} className="bg-gradient-to-r from-black/60 to-black/90 border-r-4 border-r-[#00ff88] border-y border-y-[#00ff88]/30 border-l border-l-black backdrop-blur-md p-3 flex flex-col gap-3 shadow-[0_0_20px_rgba(0,255,136,0.15)] animate-in slide-in-from-right-8 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="text-3xl select-none leading-none drop-shadow-md">{wep.weaponType === 'gun' ? '🔫' : wep.weaponType === 'melee' ? '🔪' : '💣'}</div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="text-[#00ff88] font-display text-base truncate uppercase leading-tight">{wep.name}</div>
                <div className="text-gray-400 font-mono text-[10px] uppercase flex justify-between mt-1">
                  <span>{wep.weaponType}</span>
                  <span className="text-white">DMG: {Math.round(wep.damage)}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onTake(loot.id); }}
              className="w-full bg-[#00ff88]/10 hover:bg-[#00ff88] text-[#00ff88] hover:text-black border border-[#00ff88]/50 py-2 font-display text-xs tracking-widest transition-all ease-out duration-300 hover:shadow-[0_0_15px_#00ff88]"
            >
              TAKE ITEM
            </button>
          </div>
        );
      })}
    </div>
  );
}
