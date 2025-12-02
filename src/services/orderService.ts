import type { Order } from "../types";

export const PROCESS_DURATION = 10_000;

export function insertOrder(queue: Order[], order: Order): Order[] {
  if (queue.some((q) => q.id === order.id)) return queue;

  const next = [...queue];

  if (order.type === "VIP") {
    const insertBeforeVip = next.findIndex(
      (q) => q.type === "VIP" && q.createdAt > order.createdAt
    );
    if (insertBeforeVip !== -1) {
      next.splice(insertBeforeVip, 0, order);
      return next;
    }

    const firstNormal = next.findIndex((q) => q.type === "Normal");
    next.splice(firstNormal === -1 ? next.length : firstNormal, 0, order);
    return next;
  }

  const firstNormal = next.findIndex((q) => q.type === "Normal");
  if (firstNormal === -1) {
    next.push(order);
    return next;
  }

  // Insert Normal orders by created time after VIP block
  const laterNormalOffset = next
    .slice(firstNormal)
    .findIndex((q) => q.createdAt > order.createdAt);
  const insertAt =
    laterNormalOffset === -1 ? next.length : firstNormal + laterNormalOffset;

  next.splice(insertAt, 0, order);
  return next;
}

export function clamp(v: number, min = 0, max = 1) {
  return Math.min(Math.max(v, min), max);
}

export function orderProgress(order: Order, now: number) {
  if (!order.startedAt) return 0;
  return clamp((now - order.startedAt) / PROCESS_DURATION) * 100;
}
