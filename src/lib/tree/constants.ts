import type { ZoneKey } from "./types";

export const ROOT_SLOTS = [
  { id: "root-1", x: 25, y: 94 },
  { id: "root-2", x: 36, y: 95 },
  { id: "root-3", x: 47, y: 95.5 },
  { id: "root-4", x: 58, y: 95.5 },
  { id: "root-5", x: 69, y: 95 },
  { id: "root-6", x: 80, y: 93 },
] as const;

export const BRANCH_SLOTS = [
  { id: "branch-1", x: 48, y: 36, angle: 0 },
  { id: "branch-2", x: 28, y: 42, angle: -25 },
  { id: "branch-3", x: 72, y: 42, angle: 25 },
  { id: "branch-4", x: 26, y: 67, angle: 25 },
  { id: "branch-5", x: 72, y: 67, angle: -25 },
] as const;

export const ORANGE_POSITIONS = [
  { x: 50, y: 15 },
  { x: 35, y: 12 },
  { x: 65, y: 12 },
  { x: 20, y: 25 },
  { x: 80, y: 25 },
  { x: 12, y: 35 },
  { x: 88, y: 35 },
  { x: 18, y: 48 },
  { x: 82, y: 48 },
  { x: 10, y: 22 },
  { x: 90, y: 22 },
  { x: 28, y: 18 },
  { x: 72, y: 18 },
  { x: 25, y: 40 },
  { x: 75, y: 40 },
] as const;

export const TRUNK = { centerX: 50, centerY: 48, radius: 16 };

export const BRANCH_LIMIT = 5;

export const ZONE_KEYS: ZoneKey[] = ["roots", "trunk", "branches", "crown"];

export const ZONE_INFO: Record<
  ZoneKey,
  { name: string; color: string; bg: string; label: string; tagline: string }
> = {
  roots: {
    name: "Опоры",
    color: "var(--terracotta-dark)",
    bg: "var(--terracotta)",
    label: "Опора",
    tagline: "твоя точка возврата",
  },
  trunk: {
    name: "Ресурсы",
    color: "var(--moss-dark)",
    bg: "var(--moss)",
    label: "Ресурс",
    tagline: "то, что у тебя есть сейчас",
  },
  branches: {
    name: "Ветки фокуса",
    color: "var(--sage-dark)",
    bg: "var(--sage)",
    label: "Ветка фокуса",
    tagline: "куда ты направляешь энергию",
  },
  crown: {
    name: "Плоды",
    color: "var(--coral-dark)",
    bg: "var(--coral)",
    label: "Плод",
    tagline: "конкретные шаги",
  },
};
