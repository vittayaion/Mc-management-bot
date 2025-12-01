import type { Order } from "../types";

export const PROCESS_DURATION = 10_000;

export function insertOrder(queue: Order[], order: Order): Order[] {
  if (queue.some((q) => q.id === order.id)) return queue;

  if (order.type === "Normal") return [...queue, order];

  const next = [...queue];
  let lastVip = -1;

  for (let i = 0; i < next.length; i++) {
    if (next[i].type === "VIP") lastVip = i;
  }

  next.splice(lastVip + 1, 0, order);
  return next;
}

export function clamp(v: number, min = 0, max = 1) {
  return Math.min(Math.max(v, min), max);
}

export function orderProgress(order: Order, now: number) {
  if (!order.startedAt) return 0;
  return clamp((now - order.startedAt) / PROCESS_DURATION) * 100;
}
