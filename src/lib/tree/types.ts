export type ZoneKey = "roots" | "trunk" | "branches" | "crown";

export type Horizon = "6m" | "1y" | "3y";

export interface RootItemData {
  id: string;
  text: string;
  slotId?: string;
  x?: number;
  y?: number;
  createdAt: number;
  updatedAt: number;
}

export interface TrunkItemData {
  id: string;
  text: string;
  x?: number;
  y?: number;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface BranchItemData {
  id: string;
  text: string;
  slotId: string;
  createdAt: number;
  updatedAt: number;
}

export interface FruitItemData {
  id: string;
  text: string;
  x: number;
  y: number;
  harvested: boolean;
  harvestedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface TreeItems {
  roots: RootItemData[];
  trunk: TrunkItemData[];
  branches: BranchItemData[];
  crown: FruitItemData[];
}

export type ZoneItem<Z extends ZoneKey> = Z extends "roots"
  ? RootItemData
  : Z extends "trunk"
    ? TrunkItemData
    : Z extends "branches"
      ? BranchItemData
      : FruitItemData;
