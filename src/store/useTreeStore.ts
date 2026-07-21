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
  Horizon,
  RootItemData,
  TreeItems,
  TrunkItemData,
  ZoneKey,
} from "@/lib/tree/types";
import {
  createTree,
  deleteItemRemote,
  dragItemRemote,
  fetchTreeItems,
  findTree,
  insertBranch,
  insertFruit,
  insertRoot,
  insertTrunkItem,
  migrateLocalItemsToSupabase,
  toggleHarvestRemote,
  updateItemTextRemote,
  updateTreeHorizonRemote,
} from "@/lib/supabase/tree";
import { capture } from "@/lib/posthog/capture";

const EMPTY_ITEMS: TreeItems = { roots: [], trunk: [], branches: [], crown: [] };

type AnyItem = RootItemData | TrunkItemData | BranchItemData | FruitItemData;

interface TreeStore {
  items: TreeItems;
  horizon: Horizon | null;
  hasHydrated: boolean;
  userId: string | null;
  treeId: string | null;
  remoteLoading: boolean;
  setHasHydrated: (value: boolean) => void;
  /** Loads (or migrates anonymous localStorage data into) the signed-in user's tree. */
  initForUser: (userId: string) => Promise<void>;
  /** Resets to a fresh anonymous state on sign-out — never keeps a signed-in user's data around locally. */
  clearUser: () => void;
  setHorizon: (value: Horizon) => void;
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
    (set, get) => ({
      items: EMPTY_ITEMS,
      horizon: null,
      hasHydrated: false,
      userId: null,
      treeId: null,
      remoteLoading: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      initForUser: async (userId) => {
        if (get().userId === userId && get().treeId) return;
        set({ remoteLoading: true, userId });
        try {
          const existingTree = await findTree(userId);
          if (existingTree) {
            const items = await fetchTreeItems(existingTree.id);
            set({
              treeId: existingTree.id,
              items,
              horizon: existingTree.horizon,
              remoteLoading: false,
            });
            return;
          }

          const localItems = get().items;
          const localHorizon = get().horizon;
          const hasLocalContent =
            localItems.roots.length > 0 ||
            localItems.trunk.length > 0 ||
            localItems.branches.length > 0 ||
            localItems.crown.length > 0;

          const newTreeId = await createTree(userId, localHorizon);
          if (hasLocalContent) {
            await migrateLocalItemsToSupabase(newTreeId, localItems);
          }
          set({
            treeId: newTreeId,
            items: hasLocalContent ? localItems : EMPTY_ITEMS,
            remoteLoading: false,
          });
        } catch (e) {
          console.error("Failed to load tree for user", e);
          set({ remoteLoading: false });
        }
      },

      clearUser: () => set({ userId: null, treeId: null, items: EMPTY_ITEMS, horizon: null }),

      setHorizon: (value) => {
        set({ horizon: value });
        capture("horizon_chosen", { value });
        const { userId, treeId } = get();
        if (userId && treeId) {
          updateTreeHorizonRemote(treeId, value).catch((e) =>
            console.error("Supabase updateTreeHorizon failed", e),
          );
        }
      },

      addRoot: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        let newItem: RootItemData | null = null;
        let isFirst = false;
        set((state) => {
          isFirst = state.items.roots.length === 0;
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
          newItem = item;
          return { items: { ...state.items, roots: [...state.items.roots, item] } };
        });
        capture("item_added", { zone: "roots" });
        if (isFirst) capture("first_item_added", { zone: "roots" });
        const { userId, treeId } = get();
        if (userId && treeId && newItem) {
          insertRoot(treeId, newItem).catch((e) => console.error("Supabase insertRoot failed", e));
        }
      },

      addTrunkItem: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        let newItem: TrunkItemData | null = null;
        let isFirst = false;
        set((state) => {
          isFirst = state.items.trunk.length === 0;
          const now = Date.now();
          const item: TrunkItemData = {
            id: crypto.randomUUID(),
            text: trimmed,
            pinned: false,
            createdAt: now,
            updatedAt: now,
          };
          newItem = item;
          return { items: { ...state.items, trunk: [...state.items.trunk, item] } };
        });
        capture("item_added", { zone: "trunk" });
        if (isFirst) capture("first_item_added", { zone: "trunk" });
        const { userId, treeId } = get();
        if (userId && treeId && newItem) {
          insertTrunkItem(treeId, newItem).catch((e) =>
            console.error("Supabase insertTrunkItem failed", e),
          );
        }
      },

      addBranch: (text) => {
        const trimmed = text.trim();
        let added = false;
        let isFirst = false;
        let newItem: BranchItemData | null = null;
        set((state) => {
          const used = new Set(state.items.branches.map((b) => b.slotId));
          const freeSlot = BRANCH_SLOTS.find((s) => !used.has(s.id));
          if (!trimmed || state.items.branches.length >= BRANCH_LIMIT || !freeSlot) {
            return state;
          }
          added = true;
          isFirst = state.items.branches.length === 0;
          const now = Date.now();
          const item: BranchItemData = {
            id: crypto.randomUUID(),
            text: trimmed,
            slotId: freeSlot.id,
            createdAt: now,
            updatedAt: now,
          };
          newItem = item;
          return { items: { ...state.items, branches: [...state.items.branches, item] } };
        });
        if (added && newItem) {
          capture("item_added", { zone: "branches" });
          if (isFirst) capture("first_item_added", { zone: "branches" });
          const { userId, treeId } = get();
          if (userId && treeId) {
            insertBranch(treeId, newItem).catch((e) =>
              console.error("Supabase insertBranch failed", e),
            );
          }
        }
        return added;
      },

      addFruit: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        let newItem: FruitItemData | null = null;
        let isFirst = false;
        set((state) => {
          isFirst = state.items.crown.length === 0;
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
          newItem = item;
          return { items: { ...state.items, crown: [...state.items.crown, item] } };
        });
        capture("item_added", { zone: "crown" });
        if (isFirst) capture("first_item_added", { zone: "crown" });
        const { userId, treeId } = get();
        if (userId && treeId && newItem) {
          insertFruit(treeId, newItem).catch((e) => console.error("Supabase insertFruit failed", e));
        }
      },

      updateItemText: (zone, id, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        set((state) => ({
          items: {
            ...state.items,
            [zone]: (state.items[zone] as AnyItem[]).map((i) =>
              i.id === id ? { ...i, text: trimmed, updatedAt: Date.now() } : i,
            ),
          } as TreeItems,
        }));
        capture("item_edited", { zone });
        const { userId, treeId } = get();
        if (userId && treeId) {
          updateItemTextRemote(zone, id, trimmed).catch((e) =>
            console.error("Supabase updateItemText failed", e),
          );
        }
      },

      deleteItem: (zone, id) => {
        set((state) => ({
          items: {
            ...state.items,
            [zone]: (state.items[zone] as AnyItem[]).filter((i) => i.id !== id),
          } as TreeItems,
        }));
        capture("item_deleted", { zone });
        const { userId, treeId } = get();
        if (userId && treeId) {
          deleteItemRemote(zone, id).catch((e) => console.error("Supabase deleteItem failed", e));
        }
      },

      // No analytics capture here on purpose — this fires on every mousemove
      // tick during a drag. item_dragged is captured once, at drag-end, from
      // the component layer (useDraggable's onDragEnd) instead.
      dragItem: (zone, id, x, y) => {
        set((state) => ({
          items: {
            ...state.items,
            [zone]: (state.items[zone] as AnyItem[]).map((i) =>
              i.id === id
                ? { ...i, x, y, updatedAt: Date.now(), ...(zone === "trunk" && { pinned: true }) }
                : i,
            ),
          } as TreeItems,
        }));
        const { userId, treeId } = get();
        if (userId && treeId) {
          dragItemRemote(zone, id, x, y).catch((e) => console.error("Supabase dragItem failed", e));
        }
      },

      toggleHarvest: (id) => {
        let harvestedNext = false;
        let createdAt = Date.now();
        set((state) => ({
          items: {
            ...state.items,
            crown: state.items.crown.map((f) => {
              if (f.id !== id) return f;
              harvestedNext = !f.harvested;
              createdAt = f.createdAt;
              return {
                ...f,
                harvested: harvestedNext,
                harvestedAt: harvestedNext ? Date.now() : undefined,
                updatedAt: Date.now(),
              };
            }),
          },
        }));
        if (harvestedNext) {
          const timeSinceAddedDays = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);
          capture("fruit_harvested", { time_since_added_days: Math.round(timeSinceAddedDays * 10) / 10 });
        } else {
          capture("fruit_unharvested");
        }
        const { userId, treeId } = get();
        if (userId && treeId) {
          toggleHarvestRemote(id, harvestedNext).catch((e) =>
            console.error("Supabase toggleHarvest failed", e),
          );
        }
      },

      clearAll: () => set({ items: EMPTY_ITEMS }),
    }),
    {
      name: "tos-tree-items-v1",
      skipHydration: true,
      // Never mirror a signed-in user's tree into the anonymous localStorage
      // slot — that would leak their data into the next anonymous session
      // on the same browser (CLAUDE.md privacy principle #1).
      partialize: (state) => ({
        items: state.userId ? EMPTY_ITEMS : state.items,
        horizon: state.userId ? null : state.horizon,
      }),
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
