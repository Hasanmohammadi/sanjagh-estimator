export const queryKeys = {
  projects: ["projects"] as const,

  project: (id: string) => ["projects", id] as const,

  rooms: (projectId: string) => ["projects", projectId, "rooms"] as const,

  room: (projectId: string, roomId: string) => ["projects", projectId, "rooms", roomId] as const,

  estimate: (projectId: string) => ["projects", projectId, "estimate"] as const,

  calculate: (projectId: string) => ["projects", projectId, "calculate"] as const,

  priceConfig: ["price-config"] as const,

  draft: ["draft"] as const,

  draftRooms: ["draft", "rooms"] as const,

  draftCalculate: ["draft", "calculate"] as const,
};
