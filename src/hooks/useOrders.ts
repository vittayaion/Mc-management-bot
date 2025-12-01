import { useMemo, useState } from "react";
import { insertOrder } from "../services/orderService";
import { OrderStatus } from "../types";
import type { Order, OrderType } from "../types";

export function useOrders() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [nextOrderId, setNextOrderId] = useState(1);

  const createOrder = (type: OrderType) => {
    setPendingOrders((prev) =>
      insertOrder(prev, {
        id: nextOrderId,
        type,
        status: OrderStatus.Pending,
        createdAt: Date.now(),
      })
    );
    setNextOrderId((id) => id + 1);
  };

  const markOrderComplete = (order: Order) => {
    setCompletedOrders((prev) =>
      prev.some((o) => o.id === order.id)
        ? prev
        : [...prev, { ...order, status: OrderStatus.Complete }]
    );
    setPendingOrders((prev) => prev.filter((o) => o.id !== order.id));
  };

  const removePendingById = (orderId: number) => {
    setPendingOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const pendingWithProcessing = useMemo(
    () => (orders: Order[]) => [...orders, ...pendingOrders],
    [pendingOrders]
  );

  return {
    pendingOrders,
    completedOrders,
    createOrder,
    markOrderComplete,
    removePendingById,
    setPendingOrders,
    setCompletedOrders,
    pendingWithProcessing,
  };
}
