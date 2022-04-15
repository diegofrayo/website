import type { T_ItemCategory } from "~/types";

export type T_Timeline = {
  categories: T_TimelineCategory[];
  items: { year: number; title: string; items: T_TimelineItem[] }[];
};

type T_TimelineCategory = T_ItemCategory & { emoji: string };

type T_TimelineItem = {
  id: string;
  startDate: string;
  endDate: string;
  description: string;
  categories: T_TimelineCategory[];
  assets: string[];
};
