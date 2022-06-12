export type T_TimelineFetchRawResponse = {
  categories: Array<{
    id: string;
    value: string;
    emoji: string;
  }>;
  data: Array<{
    id: string;
    start_date: string;
    end_date: string;
    description: string;
    categories: Array<string>;
    assets: Array<unknown>;
  }>;
};

export type T_TimelineFetchResponse = { timeline: T_Timeline; categories: T_TimelineCategory[] };

export type T_Timeline = T_TimelineGroup[];

export type T_TimelineGroup = { year: number; title: string; items: T_TimelineGroupItem[] };

export type T_TimelineGroupItem = {
  id: string;
  startDate: string;
  endDate: string;
  description: string;
  categories: T_TimelineCategory[];
  assets: string[];
};

export type T_TimelineCategory = { id: string; value: string; emoji: string };
