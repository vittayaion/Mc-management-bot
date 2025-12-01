export type OrderType = "VIP" | "Normal";
export type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETE";
export type BotStatus = "IDLE" | "PROCESSING";

export type Order = {
  id: number;
  type: OrderType;
  status: OrderStatus;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  botId?: number;
};

export type Bot = {
  id: number;
  status: BotStatus;
  currentOrder?: Order;
};
