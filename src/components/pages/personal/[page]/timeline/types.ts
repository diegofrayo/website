import type { T_GenericType1 } from "~/types";

export type T_Timeline = {
  categories: T_TimelineCategory[];
  items: { year: number; title: string; items: T_TimelineItem[] }[];
};

type T_TimelineCategory = T_GenericType1 & { emoji: string };

type T_TimelineItem = {
  id: string;
  startDate: string;
  endDate: string;
  description: string;
  categories: T_TimelineCategory[];
  assets: string[];
};
