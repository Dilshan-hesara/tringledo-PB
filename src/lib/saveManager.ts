import { GameState } from '../hooks/useGameEngine';
import { auth, firestore } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface WorldSaveMetadata {
    id: string;
    name: string;
    lastPlayed: number;
    /** Accumulated playtime in real seconds */
    playTime: number;
}

export interface WorldSave {
    metadata: WorldSaveMetadata;
    state: Partial<GameState>;
}

const STORAGE_KEY = 'pansil_breaker_worlds';

export function generateSaveId(): string {
    return 'world_' + Math.random().toString(36).substring(2, 9);
}

function getAllSaves(): Record<string, WorldSave> {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) return JSON.parse(data);
    } catch (e) {
        console.error('Failed to parse saves from localStorage', e);
    }
    return {};
}

function saveAllSaves(saves: Record<string, WorldSave>, toCloud: boolean = false) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));

        if (!toCloud) return;

        const user = auth.currentUser;
        if (user && !user.isAnonymous && firestore) {
            const cloudSaves: Record<string, WorldSave> = {};
            for (const [id, save] of Object.entries(saves)) {
                cloudSaves[id] = { metadata: save.metadata };
            }
            const docRef = doc(firestore, `users/${user.uid}`);
            setDoc(docRef, { saves: cloudSaves }, { mergeFields: ['saves'] }).catch(e => {
                console.error('Failed to sync saves to Firestore:', e);
            });
        }
    } catch (e) {
        console.error('Failed to save to localStorage', e);
    }
}

export function listSaves(): WorldSaveMetadata[] {
    return Object.values(getAllSaves())
        .map(s => s.metadata)
        .sort((a, b) => b.lastPlayed - a.lastPlayed);
}

export function loadSave(id: string): WorldSave | null {
    return getAllSaves()[id] || null;
}

/**
 * Save or update a world. `sessionSeconds` is the number of real seconds played
 * in the *current session* (not cumulative). It is ADDED to the previously stored playTime.
 */
export function saveWorld(
    id: string,
    name: string,
    state: Partial<GameState>,
    sessionSeconds: number,
    toCloud: boolean = false
): WorldSave {
    const saves = getAllSaves();

    const cleanState = { ...state };
    delete cleanState.syncPlayer;
    delete cleanState.syncNPCs;
    delete cleanState.syncItemPickup;
    delete cleanState.keys;
    delete cleanState.visualRemotePlayers;
    delete cleanState.remotePlayers;
    delete cleanState.remoteNPCs;
    delete cleanState.isHost;

    // Accumulate: start with whatever was previously saved
    const existing = saves[id];
    const previousPlayTime = existing?.metadata?.playTime ?? 0;

    const save: WorldSave = {
        metadata: {
            id,
            name,
            lastPlayed: Date.now(),
            playTime: previousPlayTime + sessionSeconds,
        },
        state: cleanState,
    };

    saves[id] = save;
    saveAllSaves(saves, toCloud);
    return save;
}

export function deleteSave(id: string) {
    const saves = getAllSaves();
    delete saves[id];
    saveAllSaves(saves);
}

export function exportSavesToString(): string {
    return JSON.stringify(getAllSaves(), null, 2);
}

export function importSavesFromString(jsonString: string): boolean {
    try {
        const imported = JSON.parse(jsonString);
        if (typeof imported === 'object' && imported !== null) {
            const merged = { ...getAllSaves(), ...imported };
            saveAllSaves(merged);
            return true;
        }
    } catch (e) {
        console.error('Error importing saves', e);
    }
    return false;
}

export async function fetchSavesFromFirebase(): Promise<void> {
    try {
        const user = auth.currentUser;
        if (user && !user.isAnonymous && firestore) {
            const docRef = doc(firestore, `users/${user.uid}`);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                const data = snapshot.data();
                if (data && data.saves) {
                    const cloudSaves = data.saves;
                    if (typeof cloudSaves === 'object' && cloudSaves !== null) {
                        // Merge cloud saves with local saves, preferring local saves (has full state)
                        const currentSaves = getAllSaves();
                        const merged = { ...cloudSaves, ...currentSaves };
                        saveAllSaves(merged);
                    }
                }
            }
        }
    } catch (e) {
        console.error('Failed to fetch saves from Firestore:', e);
    }
}

