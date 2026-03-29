import type { BuildingType } from '../components/BuildingInteractionWindow';

export const INTERIOR_TILE_SIZE = 50;

export type InteriorTile = 'floor' | 'wall' | 'exit' | 'jail_bars';
export type InteriorTheme = 'corporate' | 'club' | 'police' | 'bar' | 'safehouse' | 'lotus' | 'generic';

export interface InteriorFurniture {
  type: 'desk' | 'chair' | 'bed' | 'bar_counter' | 'shelf' | 'table' | 'jail_bed' | 'computer' | 'plant' | 'server_rack' | 'sofa' | 'arcade' | 'neon_light';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface InteriorNPC {
  id: string;
  type: 'npc' | 'cop' | 'boss';
  name: string;
  color?: string;
  facing: number;
  x: number;
  y: number;
  dialogue?: string[];
  aiTimer?: number;
  aiTarget?: { x: number; y: number } | null;
}

export interface InteriorState {
  buildingId: string;
  theme: InteriorTheme;
  width: number;
  height: number;
  tiles: InteriorTile[][];
  furniture: InteriorFurniture[];
  npcs: InteriorNPC[];
  spawnX: number;
  spawnY: number;
  playerOutsidePos: { x: number; y: number };
}

// Keep an empty object for backwards compatibility with useGameEngine until we fully refactor it
export const INTERIOR_LAYOUTS: Record<string, any> = {};

function makeInteriorPRNG(seed: number) {
  let s = seed >>> 0;
  return function rng(): number {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateProceduralInterior(buildingId: string, bType: BuildingType, seed: number): Omit<InteriorState, 'buildingId' | 'playerOutsidePos'> {
  const rng = makeInteriorPRNG(seed);
  
  // Decide dimensions based on building type
  const width = 12 + Math.floor(rng() * 8);
  const height = 12 + Math.floor(rng() * 8);
  
  // Create empty floor
  const tiles: InteriorTile[][] = Array(height).fill(null).map(() => Array(width).fill('floor'));
  
  // Add walls around edges
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        tiles[y][x] = 'wall';
      }
    }
  }
  
  // Set exit at bottom center
  const exitX = Math.floor(width / 2);
  tiles[height - 1][exitX] = 'exit';
  tiles[height - 1][exitX - 1] = 'exit';
  
  const spawnX = exitX;
  const spawnY = height - 2;
  
  const furniture: InteriorFurniture[] = [];
  const npcs: InteriorNPC[] = [];
  
  // Generate specific rooms/furniture based on building type
  let theme: InteriorTheme = 'generic';

  // Override theme for specific landmarks
  if (buildingId === 'lm_lotus_tower') {
    theme = 'lotus';
  } else if (buildingId === 'lm_corp_office') {
    theme = 'corporate';
  }

  if (bType === 'karma_mart') {
     theme = 'generic';
     // Shelves in the middle
     for (let i = 2; i < width - 2; i += 3) {
       furniture.push({ type: 'shelf', x: i, y: 3, width: 2, height: 1 });
       furniture.push({ type: 'shelf', x: i, y: 6, width: 2, height: 1 });
     }
     furniture.push({ type: 'arcade', x: width - 3, y: 1, width: 1, height: 1 });
     // Counter near the exit
     furniture.push({ type: 'bar_counter', x: 2, y: height - 4, width: 3, height: 1 });
     
     // Merchant
     npcs.push({ id: `int_npc_${buildingId}_merchant`, type: 'npc', name: 'MERCHANT', color: '#ffcc00', facing: Math.PI / 2, x: 3, y: height - 5, dialogue: ["Welcome to Karma Mart. Don't cause trouble."] });
  } else if (bType === 'club_nirvana') {
     theme = 'club';
     // Neon Lights on back wall
     furniture.push({ type: 'neon_light', x: 2, y: 1, width: 2, height: 1 });
     furniture.push({ type: 'neon_light', x: width - 4, y: 1, width: 2, height: 1 });
     
     // Arcade corner
     furniture.push({ type: 'arcade', x: 2, y: 3, width: 1, height: 1 });
     furniture.push({ type: 'arcade', x: 3, y: 3, width: 1, height: 1 });

     // Bar counter
     furniture.push({ type: 'bar_counter', x: 2, y: 7, width: width - 4, height: 1 });
     
     // Bartender
     npcs.push({ id: `int_npc_${buildingId}_bartender`, type: 'npc', name: 'BARTENDER', color: '#cc33ff', facing: Math.PI / 2, x: exitX, y: 6, dialogue: ["What can I get you?"] });
     
     // Dancers
     for (let i = 0; i < 3 + Math.floor(rng() * 3); i++) {
        npcs.push({ id: `int_npc_${buildingId}_dancer_${i}`, type: 'npc', name: 'PATRON', color: '#ff33aa', facing: rng() * Math.PI * 2, x: 2 + rng() * (width - 4), y: 8 + rng() * (height - 11), dialogue: ["This beat is sick!"] });
     }
  } else if (bType === 'corporate') {
     theme = 'corporate';
     // Reception
     furniture.push({ type: 'plant', x: 2, y: height - 3, width: 1, height: 1 });
     furniture.push({ type: 'plant', x: width - 3, y: height - 3, width: 1, height: 1 });
     furniture.push({ type: 'sofa', x: width - 4, y: height - 5, width: 3, height: 1 });

     // Server Room / Workstations
     for (let y = 3; y < height - 6; y += 4) {
       for (let x = 2; x < width - 3; x += 4) {
         if (rng() > 0.8) {
           furniture.push({ type: 'server_rack', x, y, width: 1, height: 1 });
         } else {
           furniture.push({ type: 'desk', x, y, width: 2, height: 1 });
           furniture.push({ type: 'chair', x: x + 0.5, y: y + 1, width: 1, height: 1 });
           if (rng() > 0.3) {
             npcs.push({ id: `int_npc_${buildingId}_worker_${x}_${y}`, type: 'npc', name: 'CLERK', color: '#00ccff', facing: -Math.PI / 2, x: x + 1, y: y + 1.5, dialogue: ["I'm so behind on these reports..."] });
           }
         }
       }
     }
  } else if (bType === 'police_station') {
     theme = 'police'; // generic or police specific? Let's use generic with different props, maybe corp
     theme = 'corporate'; // It matches white walls and clean floors
     
     // Front desk
     furniture.push({ type: 'desk', x: exitX - 2, y: height - 4, width: 4, height: 1 });
     npcs.push({ id: `int_cop_${buildingId}_sergeant`, type: 'cop', name: 'DESK SERGEANT', color: '#1155ff', facing: Math.PI / 2, x: exitX, y: height - 5, dialogue: ["Can I help you, citizen?"] });
     
     // Jail cells at the back
     for (let x = 1; x < width - 1; x++) {
       tiles[4][x] = 'jail_bars';
     }
     tiles[4][2] = 'floor'; // Cell door 1
     tiles[4][width - 3] = 'floor'; // Cell door 2
     
     // Jail beds
     furniture.push({ type: 'jail_bed', x: 2, y: 1, width: 1, height: 2 });
     furniture.push({ type: 'jail_bed', x: width - 3, y: 1, width: 1, height: 2 });
     
     // Cops
     for (let i = 0; i < 2 + Math.floor(rng() * 2); i++) {
        npcs.push({ id: `int_cop_${buildingId}_patrol_${i}`, type: 'cop', name: 'OFFICER', color: '#3377ff', facing: rng() * Math.PI * 2, x: 2 + rng() * (width - 4), y: 6 + rng() * (height - 10), dialogue: ["Move along."] });
     }
  } else if (bType === 'underground_bar') {
     theme = 'bar';
     furniture.push({ type: 'neon_light', x: 2, y: 1, width: 2, height: 1 });
     furniture.push({ type: 'bar_counter', x: width - 3, y: 2, width: 1, height: height - 6 });
     npcs.push({ id: `int_npc_${buildingId}_barkeep`, type: 'npc', name: 'BARKEEP', color: '#ff33aa', facing: Math.PI, x: width - 2, y: Math.floor(height/2), dialogue: ["Keep your head down."] });
     
     for (let i = 0; i < 2 + Math.floor(rng() * 4); i++) {
        if (rng() > 0.5) {
            furniture.push({ type: 'sofa', x: 2 + rng() * (width - 8), y: 2 + rng() * (height - 8), width: 3, height: 1 });
        } else {
            furniture.push({ type: 'table', x: 2 + rng() * (width - 8), y: 2 + rng() * (height - 8), width: 2, height: 2 });
        }
     }
  } else if (bType === 'safehouse') {
     theme = 'safehouse';
     furniture.push({ type: 'bed', x: 2, y: 2, width: 2, height: 3 });
     furniture.push({ type: 'desk', x: width - 4, y: 2, width: 2, height: 1 });
     furniture.push({ type: 'computer', x: width - 3, y: 2, width: 1, height: 1 });
     furniture.push({ type: 'chair', x: width - 3, y: 3, width: 1, height: 1 });
     furniture.push({ type: 'plant', x: width - 2, y: height - 3, width: 1, height: 1 });
     furniture.push({ type: 'sofa', x: 2, y: height - 4, width: 3, height: 1 });
  }

  return {
    theme,
    width,
    height,
    tiles,
    furniture,
    npcs,
    spawnX,
    spawnY
  };
}
