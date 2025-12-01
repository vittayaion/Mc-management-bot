export type OrderType = "VIP" | "Normal";

export const OrderStatus = {
  Pending: "PENDING",
  Processing: "PROCESSING",
  Complete: "COMPLETE",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const BotStatus = {
  Idle: "IDLE",
  Processing: "PROCESSING",
} as const;

export type BotStatus = (typeof BotStatus)[keyof typeof BotStatus];

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
