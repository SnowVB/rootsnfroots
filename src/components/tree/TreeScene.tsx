"use client";

import { useEffect, useRef, useState } from "react";
import { trunkAutoPosition, useTreeStore } from "@/store/useTreeStore";
import type { BranchItemData, FruitItemData, RootItemData, TrunkItemData } from "@/lib/tree/types";
import { BranchItem } from "./BranchItem";
import { FruitItem } from "./FruitItem";
import { QuestionsDrawer } from "./QuestionsDrawer";
import { RootItem } from "./RootItem";
import { TrunkItemView } from "./TrunkItemView";

interface TreeSceneProps {
  onEditRoot: (item: RootItemData) => void;
  onEditTrunk: (item: TrunkItemData) => void;
  onEditBranch: (item: BranchItemData) => void;
  onEditFruit: (item: FruitItemData) => void;
}

export function TreeScene({ onEditRoot, onEditTrunk, onEditBranch, onEditFruit }: TreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // A cached image can finish loading before this listener attaches, so the
  // "load" event never fires — check .complete on mount as a fallback.
  useEffect(() => {
    if (imgRef.current?.complete) setImageLoaded(true);
  }, []);

  const items = useTreeStore((s) => s.items);
  const hasHydrated = useTreeStore((s) => s.hasHydrated);
  const remoteLoading = useTreeStore((s) => s.remoteLoading);
  const deleteItem = useTreeStore((s) => s.deleteItem);
  const dragItem = useTreeStore((s) => s.dragItem);
  const toggleHarvest = useTreeStore((s) => s.toggleHarvest);

  const autoTrunk = items.trunk.filter((t) => !t.pinned);
  const ready = imageLoaded && hasHydrated && !remoteLoading;

  return (
    <div
      className="relative flex flex-1 items-center justify-center overflow-hidden p-5"
      style={{
        backgroundImage: "url(/tree.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="absolute inset-0 z-0 backdrop-blur-[30px] backdrop-brightness-[0.6] backdrop-saturate-[1.05]"
        style={{ background: "rgba(25,35,45,0.25)" }}
      />

      <div ref={containerRef} className="relative z-[1] inline-block max-h-full max-w-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- drag math needs the raster's rendered box, not next/image's layout wrapper */}
        <img
          ref={imgRef}
          src="/tree.png"
          alt="Дерево Опоры"
          onLoad={() => setImageLoaded(true)}
          className="block max-h-[calc(100vh-80px)] max-w-full rounded-xl"
        />
        {ready && (
          <>
            {items.roots.map((item) => (
              <RootItem
                key={item.id}
                item={item}
                containerRef={containerRef}
                onEdit={onEditRoot}
                onDelete={(id) => deleteItem("roots", id)}
                onDrag={(id, x, y) => dragItem("roots", id, x, y)}
              />
            ))}
            {items.branches.map((item) => (
              <BranchItem
                key={item.id}
                item={item}
                onEdit={onEditBranch}
                onDelete={(id) => deleteItem("branches", id)}
              />
            ))}
            {items.trunk.map((item) => {
              const autoIndex = autoTrunk.findIndex((t) => t.id === item.id);
              const pos = trunkAutoPosition(item, autoIndex);
              return (
                <TrunkItemView
                  key={item.id}
                  item={item}
                  autoX={pos.x}
                  autoY={pos.y}
                  containerRef={containerRef}
                  onEdit={onEditTrunk}
                  onDelete={(id) => deleteItem("trunk", id)}
                  onDrag={(id, x, y) => dragItem("trunk", id, x, y)}
                />
              );
            })}
            {items.crown.map((item) => (
              <FruitItem
                key={item.id}
                item={item}
                containerRef={containerRef}
                onEdit={onEditFruit}
                onDelete={(id) => deleteItem("crown", id)}
                onHarvest={toggleHarvest}
                onDrag={(id, x, y) => dragItem("crown", id, x, y)}
              />
            ))}
          </>
        )}
      </div>

      <QuestionsDrawer
        open={drawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
