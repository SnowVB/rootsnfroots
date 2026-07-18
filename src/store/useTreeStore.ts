import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BRANCH_LIMIT,
  BRANCH_SLOTS,
  ORANGE_POSITIONS,
  ROOT_SLOTS,
  TRUNK,
} from "@/lib/tree/constants";
import type {
  BranchItemData,
  FruitItemData,
  RootItemData,
  TreeItems,
  TrunkItemData,
  ZoneKey,
} from "@/lib/tree/types";

const EMPTY_ITEMS: TreeItems = { roots: [], trunk: [], branches: [], crown: [] };

type AnyItem = RootItemData | TrunkItemData | BranchItemData | FruitItemData;

interface TreeStore {
  items: TreeItems;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addRoot: (text: string) => void;
  addTrunkItem: (text: string) => void;
  /** Returns false when the branch limit (CLAUDE.md D3) is reached. */
  addBranch: (text: string) => boolean;
  addFruit: (text: string) => void;
  updateItemText: (zone: ZoneKey, id: string, text: string) => void;
  deleteItem: (zone: ZoneKey, id: string) => void;
  dragItem: (zone: Exclude<ZoneKey, "branches">, id: string, x: number, y: number) => void;
  toggleHarvest: (id: string) => void;
  clearAll: () => void;
}

export const useTreeStore = create<TreeStore>()(
  persist(
    (set) => ({
      items: EMPTY_ITEMS,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addRoot: (text) =>
        set((state) => {
          const trimmed = text.trim();
          if (!trimmed) return state;
          const used = new Set(state.items.roots.map((r) => r.slotId));
          const freeSlot = ROOT_SLOTS.find((s) => !used.has(s.id));
          const now = Date.now();
          const base = { id: crypto.randomUUID(), text: trimmed, createdAt: now, updatedAt: now };
          const item: RootItemData = freeSlot
            ? { ...base, slotId: freeSlot.id }
            : (() => {
                const offset = (state.items.roots.length - ROOT_SLOTS.length) * 3;
                return { ...base, x: 50 + (offset % 30) - 15, y: 88 };
              })();
          return { items: { ...state.items, roots: [...state.items.roots, item] } };
        }),

      addTrunkItem: (text) =>
        set((state) => {
          const trimmed = text.trim();
          if (!trimmed) return state;
          const now = Date.now();
          const item: TrunkItemData = {
            id: crypto.randomUUID(),
            text: trimmed,
            pinned: false,
            createdAt: now,
            updatedAt: now,
          };
          return { items: { ...state.items, trunk: [...state.items.trunk, item] } };
        }),

      addBranch: (text) => {
        let added = false;
        set((state) => {
          const trimmed = text.trim();
          const used = new Set(state.items.branches.map((b) => b.slotId));
          const freeSlot = BRANCH_SLOTS.find((s) => !used.has(s.id));
          if (!trimmed || state.items.branches.length >= BRANCH_LIMIT || !freeSlot) {
            return state;
          }
          added = true;
          const now = Date.now();
          const item: BranchItemData = {
            id: crypto.randomUUID(),
            text: trimmed,
            slotId: freeSlot.id,
            createdAt: now,
            updatedAt: now,
          };
          return { items: { ...state.items, branches: [...state.items.branches, item] } };
        });
        return added;
      },

      addFruit: (text) =>
        set((state) => {
          const trimmed = text.trim();
          if (!trimmed) return state;
          const pos = ORANGE_POSITIONS[state.items.crown.length % ORANGE_POSITIONS.length];
          const now = Date.now();
          const item: FruitItemData = {
            id: crypto.randomUUID(),
            text: trimmed,
            x: pos.x,
            y: pos.y,
            harvested: false,
            createdAt: now,
            updatedAt: now,
          };
          return { items: { ...state.items, crown: [...state.items.crown, item] } };
        }),

      updateItemText: (zone, id, text) =>
        set((state) => {
          const trimmed = text.trim();
          if (!trimmed) return state;
          return {
            items: {
              ...state.items,
              [zone]: (state.items[zone] as AnyItem[]).map((i) =>
                i.id === id ? { ...i, text: trimmed, updatedAt: Date.now() } : i,
              ),
            } as TreeItems,
          };
        }),

      deleteItem: (zone, id) =>
        set((state) => ({
          items: {
            ...state.items,
            [zone]: (state.items[zone] as AnyItem[]).filter((i) => i.id !== id),
          } as TreeItems,
        })),

      dragItem: (zone, id, x, y) =>
        set((state) => ({
          items: {
            ...state.items,
            [zone]: (state.items[zone] as AnyItem[]).map((i) =>
              i.id === id
                ? { ...i, x, y, updatedAt: Date.now(), ...(zone === "trunk" && { pinned: true }) }
                : i,
            ),
          } as TreeItems,
        })),

      toggleHarvest: (id) =>
        set((state) => ({
          items: {
            ...state.items,
            crown: state.items.crown.map((f) =>
              f.id === id
                ? {
                    ...f,
                    harvested: !f.harvested,
                    harvestedAt: !f.harvested ? Date.now() : undefined,
                    updatedAt: Date.now(),
                  }
                : f,
            ),
          },
        })),

      clearAll: () => set({ items: EMPTY_ITEMS }),
    }),
    {
      name: "tos-tree-items-v1",
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function trunkAutoPosition(item: TrunkItemData, autoIndex: number): { x: number; y: number } {
  if (item.pinned && item.x !== undefined && item.y !== undefined) {
    return { x: item.x, y: item.y };
  }
  const r = autoIndex * 0.8;
  const angle = autoIndex * 2.5;
  return {
    x: TRUNK.centerX + r * Math.cos(angle),
    y: TRUNK.centerY + r * Math.sin(angle),
  };
}
