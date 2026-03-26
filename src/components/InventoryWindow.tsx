import React, { useState } from 'react';
import { AdvancedWeapon } from '@/hooks/useGameEngine';

interface Props {
  inventory: {
    cash: number;
    items: AdvancedWeapon[];
    primaryWeapon: AdvancedWeapon | null;
    secondaryWeapon: AdvancedWeapon | null;
    activeSlot: 'primary' | 'secondary' | null;
  };
  onClose: () => void;
  onEquip: (itemId: string, slot: 'primary' | 'secondary') => void;
  onDiscard: (itemId: string, slot: 'primary' | 'secondary' | 'inventory') => void;
}

export default function InventoryWindow({ inventory, onClose, onEquip, onDiscard }: Props) {
  const [selectedItem, setSelectedItem] = useState<{ item: AdvancedWeapon, slot: 'inventory' | 'primary' | 'secondary' } | null>(null);

  const renderSlot = (item: AdvancedWeapon | null, label: string, slotId: 'primary' | 'secondary') => (
    <div
      className={`border-2 p-2 relative flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedItem?.item.id === item?.id ? 'border-[#00ccff] bg-[#00ccff22]' : 'border-gray-700 bg-gray-900'} w-[120px] h-[120px] shrink-0`}
      onClick={() => item ? setSelectedItem({ item, slot: slotId }) : setSelectedItem(null)}
    >
      <div className="absolute top-1 left-1 text-[10px] text-gray-500 font-display">{label}</div>
      {item ? (
        <>
          <div className="text-3xl mb-1 select-none">{item.weaponType === 'gun' ? '🔫' : item.weaponType === 'melee' ? '🔪' : '💣'}</div>
          <div className="font-display text-xs text-[#00ccff] truncate w-full text-center">{item.name}</div>
          {item.weaponType === 'gun' && <div className="text-[10px] text-gray-400 mt-1">{item.ammo}/{item.maxAmmo}</div>}
          {inventory.activeSlot === slotId && <div className="absolute bottom-1 text-[10px] text-[#00ff88] animate-pulse">READY</div>}
        </>
      ) : (
        <div className="text-gray-600 text-xs">EMPTY</div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0a0a0a] border-2 border-[#00ccff] shadow-[0_0_30px_rgba(0,204,255,0.3)] flex flex-col md:flex-row h-full max-h-[600px] overflow-hidden">
        
        {/* Left: Loadout */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r-2 border-gray-800 p-6 flex flex-col bg-[#111]">
          <h2 className="text-[#00ccff] font-display text-xl mb-6 tracking-widest text-center shadow-[0_0_10px_rgba(0,204,255,0.2)]">CURRENT LOADOUT</h2>
          <div className="flex flex-row md:flex-col gap-4 items-center justify-center flex-1">
            {renderSlot(inventory.primaryWeapon, 'PRIMARY (1)', 'primary')}
            {renderSlot(inventory.secondaryWeapon, 'SECONDARY (2)', 'secondary')}
          </div>
          <div className="mt-6 text-center text-sm font-mono text-gray-400">
            CASH: <span className="text-[#ffcc00]">${inventory.cash}</span>
          </div>
        </div>

        {/* Right: Arsenal & Details */}
        <div className="w-full md:w-2/3 flex flex-col p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#00ccff] font-display text-xl tracking-widest text-shadow-[0_0_10px_#00ccff]">ARSENAL GRIMOIRE</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl leading-none transition-colors">&times;</button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-4 gap-3 mb-6 flex-1 overflow-y-auto content-start pr-2">
            {Array.from({ length: 16 }).map((_, i) => {
              const item = inventory.items[i];
              const isSelected = selectedItem?.item.id === item?.id;
              return (
                <div
                  key={i}
                  onClick={() => item ? setSelectedItem({ item, slot: 'inventory' }) : null}
                  className={`aspect-square border-2 flex flex-col justify-center items-center cursor-pointer transition-all hover:border-[#00ccff] group ${item ? 'bg-gray-900 border-gray-700' : 'bg-gray-900/30 border-gray-800/50'} ${isSelected ? 'border-[#00ccff] shadow-[0_0_15px_rgba(0,204,255,0.4)]' : ''}`}
                >
                  {item ? (
                    <>
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform select-none">{item.weaponType === 'gun' ? '🔫' : item.weaponType === 'melee' ? '🔪' : '💣'}</div>
                      <div className="text-[9px] font-display text-gray-400 max-w-[90%] truncate text-center">{item.name}</div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Selected Item Details */}
          <div className="min-h-40 border-t-2 border-gray-800 pt-4 flex gap-4">
            {selectedItem ? (
              <>
                <div className="w-1/3 flex flex-col justify-center items-center border border-gray-800 bg-gray-900/50 p-2">
                   <div className="text-4xl mb-2 select-none">{selectedItem.item.weaponType === 'gun' ? '🔫' : selectedItem.item.weaponType === 'melee' ? '🔪' : '💣'}</div>
                   <div className="font-display text-[#00ccff] text-center text-[10px] xs:text-sm truncate w-full px-1">{selectedItem.item.name}</div>
                </div>
                <div className="w-1/3 flex flex-col justify-center gap-2 font-mono text-xs text-gray-300">
                   <div className="flex justify-between"><span>DAMAGE:</span> <span className="text-white">{selectedItem.item.damage}</span></div>
                   <div className="flex justify-between"><span>SPEED:</span> <span className="text-white">{selectedItem.item.fireRate > 20 ? 'FAST' : selectedItem.item.fireRate > 10 ? 'MED' : 'SLOW'}</span></div>
                   <div className="flex justify-between"><span>RANGE:</span> <span className="text-white">{selectedItem.item.range}</span></div>
                   {selectedItem.item.weaponType === 'gun' && (
                     <div className="flex justify-between items-center text-[#ffaa00]"><span>AMMO:</span> <span className="font-bold text-sm tracking-wider">{selectedItem.item.ammo}</span></div>
                   )}
                </div>
                <div className="w-1/3 flex flex-col gap-2 justify-center">
                   {selectedItem.slot === 'inventory' ? (
                     <>
                        <button onClick={() => { onEquip(selectedItem.item.id, 'primary'); setSelectedItem(null); }} className="border border-[#00ccff] text-[#00ccff] hover:bg-[#00ccff] hover:text-black font-display py-1.5 px-1 text-xs transition-colors">EQUIP (1)</button>
                        <button onClick={() => { onEquip(selectedItem.item.id, 'secondary'); setSelectedItem(null); }} className="border border-[#00ccff] text-[#00ccff] hover:bg-[#00ccff] hover:text-black font-display py-1.5 px-1 text-xs transition-colors">EQUIP (2)</button>
                     </>
                   ) : (
                     <div className="text-center font-display text-[#00ff88] py-1.5 text-xs opacity-70 border border-[#00ff88]/30">ACTIVE LINK</div>
                   )}
                   <button onClick={() => { onDiscard(selectedItem.item.id, selectedItem.slot); setSelectedItem(null); }} className="border border-[#ff2233] text-[#ff2233] hover:bg-[#ff2233] hover:text-white font-display py-1.5 px-1 text-xs transition-colors mt-2">DISCARD</button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 font-display tracking-widest text-sm space-y-2">
                 <div>AWAITING SELECTION</div>
                 <div className="w-24 h-px bg-gray-800"></div>
                 <div className="text-xs text-gray-700">SELECT AN ITEM FOR ANALYSIS</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
