import { createClient } from "./client";
import type {
  BranchItemData,
  FruitItemData,
  RootItemData,
  TreeItems,
  TrunkItemData,
  ZoneKey,
} from "@/lib/tree/types";

// Postgres `numeric` columns come back as strings over PostgREST.
const num = (v: unknown): number | undefined =>
  v === null || v === undefined ? undefined : Number(v);

const ZONE_TABLE = {
  roots: "roots",
  trunk: "trunk_items",
  branches: "branches",
  crown: "fruits",
} as const satisfies Record<ZoneKey, string>;

export async function findTreeId(userId: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("trees")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}

export async function createTreeId(userId: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("trees")
    .insert({ user_id: userId })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function fetchTreeItems(treeId: string): Promise<TreeItems> {
  const supabase = createClient();

  const [{ data: roots, error: rootsErr }, { data: trunk, error: trunkErr }, { data: branches, error: branchesErr }, { data: crown, error: crownErr }] =
    await Promise.all([
      supabase.from("roots").select("*").eq("tree_id", treeId),
      supabase.from("trunk_items").select("*").eq("tree_id", treeId),
      supabase.from("branches").select("*").eq("tree_id", treeId),
      supabase.from("fruits").select("*").eq("tree_id", treeId),
    ]);
  if (rootsErr) throw rootsErr;
  if (trunkErr) throw trunkErr;
  if (branchesErr) throw branchesErr;
  if (crownErr) throw crownErr;

  return {
    roots: (roots ?? []).map(
      (r): RootItemData => ({
        id: r.id,
        text: r.text,
        slotId: r.slot_id ?? undefined,
        x: num(r.x),
        y: num(r.y),
        createdAt: new Date(r.created_at).getTime(),
        updatedAt: new Date(r.updated_at).getTime(),
      }),
    ),
    trunk: (trunk ?? []).map(
      (t): TrunkItemData => ({
        id: t.id,
        text: t.text,
        x: num(t.x),
        y: num(t.y),
        pinned: t.pinned,
        createdAt: new Date(t.created_at).getTime(),
        updatedAt: new Date(t.updated_at).getTime(),
      }),
    ),
    branches: (branches ?? []).map(
      (b): BranchItemData => ({
        id: b.id,
        text: b.text,
        slotId: b.slot_id,
        createdAt: new Date(b.created_at).getTime(),
        updatedAt: new Date(b.updated_at).getTime(),
      }),
    ),
    crown: (crown ?? []).map(
      (f): FruitItemData => ({
        id: f.id,
        text: f.text,
        x: num(f.x) ?? 50,
        y: num(f.y) ?? 50,
        harvested: f.harvested,
        harvestedAt: f.harvested_at ? new Date(f.harvested_at).getTime() : undefined,
        createdAt: new Date(f.created_at).getTime(),
        updatedAt: new Date(f.updated_at).getTime(),
      }),
    ),
  };
}

export async function migrateLocalItemsToSupabase(treeId: string, items: TreeItems) {
  const supabase = createClient();

  if (items.roots.length) {
    const { error } = await supabase.from("roots").insert(
      items.roots.map((r) => ({
        id: r.id,
        tree_id: treeId,
        text: r.text,
        slot_id: r.slotId ?? null,
        x: r.x ?? null,
        y: r.y ?? null,
      })),
    );
    if (error) throw error;
  }
  if (items.trunk.length) {
    const { error } = await supabase.from("trunk_items").insert(
      items.trunk.map((t) => ({
        id: t.id,
        tree_id: treeId,
        text: t.text,
        x: t.x ?? null,
        y: t.y ?? null,
        pinned: t.pinned,
      })),
    );
    if (error) throw error;
  }
  if (items.branches.length) {
    const { error } = await supabase.from("branches").insert(
      items.branches.map((b) => ({
        id: b.id,
        tree_id: treeId,
        text: b.text,
        slot_id: b.slotId,
      })),
    );
    if (error) throw error;
  }
  if (items.crown.length) {
    const { error } = await supabase.from("fruits").insert(
      items.crown.map((f) => ({
        id: f.id,
        tree_id: treeId,
        text: f.text,
        x: f.x,
        y: f.y,
        harvested: f.harvested,
        harvested_at: f.harvestedAt ? new Date(f.harvestedAt).toISOString() : null,
      })),
    );
    if (error) throw error;
  }
}

export async function insertRoot(treeId: string, item: RootItemData) {
  const supabase = createClient();
  const { error } = await supabase.from("roots").insert({
    id: item.id,
    tree_id: treeId,
    text: item.text,
    slot_id: item.slotId ?? null,
    x: item.x ?? null,
    y: item.y ?? null,
  });
  if (error) throw error;
}

export async function insertTrunkItem(treeId: string, item: TrunkItemData) {
  const supabase = createClient();
  const { error } = await supabase.from("trunk_items").insert({
    id: item.id,
    tree_id: treeId,
    text: item.text,
    x: item.x ?? null,
    y: item.y ?? null,
    pinned: item.pinned,
  });
  if (error) throw error;
}

export async function insertBranch(treeId: string, item: BranchItemData) {
  const supabase = createClient();
  const { error } = await supabase.from("branches").insert({
    id: item.id,
    tree_id: treeId,
    text: item.text,
    slot_id: item.slotId,
  });
  if (error) throw error;
}

export async function insertFruit(treeId: string, item: FruitItemData) {
  const supabase = createClient();
  const { error } = await supabase.from("fruits").insert({
    id: item.id,
    tree_id: treeId,
    text: item.text,
    x: item.x,
    y: item.y,
    harvested: item.harvested,
  });
  if (error) throw error;
}

export async function updateItemTextRemote(zone: ZoneKey, id: string, text: string) {
  const supabase = createClient();
  const { error } = await supabase.from(ZONE_TABLE[zone]).update({ text }).eq("id", id);
  if (error) throw error;
}

export async function deleteItemRemote(zone: ZoneKey, id: string) {
  const supabase = createClient();
  const { error } = await supabase.from(ZONE_TABLE[zone]).delete().eq("id", id);
  if (error) throw error;
}

export async function dragItemRemote(
  zone: Exclude<ZoneKey, "branches">,
  id: string,
  x: number,
  y: number,
) {
  const supabase = createClient();
  if (zone === "trunk") {
    const { error } = await supabase
      .from("trunk_items")
      .update({ x, y, pinned: true })
      .eq("id", id);
    if (error) throw error;
    return;
  }
  const table = zone === "roots" ? "roots" : "fruits";
  const { error } = await supabase.from(table).update({ x, y }).eq("id", id);
  if (error) throw error;
}

export async function toggleHarvestRemote(id: string, harvested: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("fruits")
    .update({ harvested, harvested_at: harvested ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw error;
}
