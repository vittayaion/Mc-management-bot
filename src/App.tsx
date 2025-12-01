import { useEffect, useMemo, useRef, useState } from "react";
import { AppLayout } from "./components/AppLayout";
import { BotActivity } from "./components/BotActivity";
import { BotSummary } from "./components/BotSummary";
import { CompletedOrders } from "./components/CompletedOrders";
import { PendingOrders } from "./components/PendingOrders";
import { NewOrderControls } from "./components/NewOrderControls";
import type { Bot, Order, OrderType } from "./types";

const PROCESS_DURATION = 10_000;
const TICK_INTERVAL = 200;

function insertOrder(queue: Order[], order: Order) {
  if (queue.some((q) => q.id === order.id)) return queue;

  if (order.type === "Normal") {
    return [...queue, order];
  }

  const nextQueue = [...queue];
  let lastVipIndex = -1;
  for (let i = 0; i < nextQueue.length; i += 1) {
    if (nextQueue[i].type === "VIP") {
      lastVipIndex = i;
    }
  }
  const insertAt = lastVipIndex + 1;
  nextQueue.splice(insertAt, 0, order);
  return nextQueue;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function orderProgress(order: Order, now: number) {
  if (!order.startedAt) return 0;
  return clamp((now - order.startedAt) / PROCESS_DURATION, 0, 1) * 100;
}

function App() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [bots, setBots] = useState<Bot[]>([]);
  const [nextOrderId, setNextOrderId] = useState(1);
  const [nextBotId, setNextBotId] = useState(1);
  const [tick, setTick] = useState(() => Date.now());
  const timersRef = useRef<Map<number, number>>(new Map());
  const completedOrderIdsRef = useRef<Set<number>>(new Set());
  const canceledOrderIdsRef = useRef<Set<number>>(new Set());

  const clearBotTimer = (botId: number) => {
    const timer = timersRef.current.get(botId);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(botId);
    }
  };

  const completeOrder = (botId: number, orderId: number) => {
    if (canceledOrderIdsRef.current.has(orderId)) {
      clearBotTimer(botId);
      canceledOrderIdsRef.current.delete(orderId);
      setBots((prevBots) =>
        prevBots.map((b) => (b.id === botId ? { id: b.id, status: "IDLE" } : b))
      );
      return;
    }

    if (completedOrderIdsRef.current.has(orderId)) {
      clearBotTimer(botId);
      return;
    }

    const bot = bots.find((b) => b.id === botId);
    const current = bot?.currentOrder;
    if (!current || current.id !== orderId) return;

    const finishedOrder: Order = {
      ...current,
      status: "COMPLETE",
      completedAt: Date.now(),
    };

    completedOrderIdsRef.current.add(orderId);
    clearBotTimer(botId);

    setBots((prevBots) =>
      prevBots.map((b) => (b.id === botId ? { id: b.id, status: "IDLE" } : b))
    );
    setPendingOrders((prev) => prev.filter((order) => order.id !== orderId));
    setCompletedOrders((prev) =>
      prev.some((order) => order.id === orderId)
        ? prev
        : [...prev, finishedOrder]
    );
  };

  const scheduleCompletion = (botId: number, orderId: number) => {
    clearBotTimer(botId);
    const timeoutId = window.setTimeout(() => {
      completeOrder(botId, orderId);
    }, PROCESS_DURATION);
    timersRef.current.set(botId, timeoutId);
  };

  useEffect(() => {
    const interval = window.setInterval(
      () => setTick(Date.now()),
      TICK_INTERVAL
    );
    return () => {
      window.clearInterval(interval);
      timersRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    bots.forEach((bot) => {
      const order = bot.currentOrder;
      if (bot.status !== "PROCESSING" || !order?.startedAt) return;
      const elapsed = tick - order.startedAt;
      if (elapsed >= PROCESS_DURATION) {
        completeOrder(bot.id, order.id);
      }
    });
  }, [bots, tick]);

  useEffect(() => {
    const idleBots = bots.filter((bot) => bot.status === "IDLE");
    if (!idleBots.length || !pendingOrders.length) return;

    const queue = [...pendingOrders];
    const nextBots = bots.map((bot) => ({ ...bot }));
    let changed = false;

    idleBots.forEach((bot) => {
      if (!queue.length) return;
      const order = queue.shift()!;
      const startedAt = Date.now();
      const processingOrder: Order = {
        ...order,
        status: "PROCESSING",
        startedAt,
        botId: bot.id,
      };
      canceledOrderIdsRef.current.delete(order.id);
      const botIndex = nextBots.findIndex((b) => b.id === bot.id);
      nextBots[botIndex] = {
        id: bot.id,
        status: "PROCESSING",
        currentOrder: processingOrder,
      };
      scheduleCompletion(bot.id, processingOrder.id);
      changed = true;
    });

    if (changed) {
      setBots(nextBots);
      setPendingOrders(queue);
    }
  }, [bots, pendingOrders]);

  const handleAddBot = () => {
    setBots((prev) => [...prev, { id: nextBotId, status: "IDLE" }]);
    setNextBotId((id) => id + 1);
  };

  const handleRemoveBot = () => {
    setBots((prevBots) => {
      if (!prevBots.length) return prevBots;
      const botToRemove = prevBots[prevBots.length - 1];

      clearBotTimer(botToRemove.id);

      if (botToRemove.status === "PROCESSING" && botToRemove.currentOrder) {
        const resetOrder: Order = {
          ...botToRemove.currentOrder,
          status: "PENDING",
          startedAt: undefined,
          botId: undefined,
        };
        setPendingOrders((prev) => insertOrder(prev, resetOrder));
      }

      return prevBots.slice(0, -1);
    });
  };

  const createOrder = (type: OrderType) => {
    setPendingOrders((prev) =>
      insertOrder(prev, {
        id: nextOrderId,
        type,
        status: "PENDING",
        createdAt: Date.now(),
      })
    );
    setNextOrderId((id) => id + 1);
  };

  const processingOrders = useMemo(
    () => bots.flatMap((bot) => (bot.currentOrder ? [bot.currentOrder] : [])),
    [bots]
  );

  const pendingDisplay = useMemo(
    () => [...processingOrders, ...pendingOrders],
    [pendingOrders, processingOrders]
  );

  const botsBusy = bots.filter((bot) => bot.status === "PROCESSING").length;

  const botLoadLabel =
    bots.length === 0 ? "No bots active" : `${botsBusy}/${bots.length} bots`;

  return (
    <AppLayout>
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-stone-900 dark:text-stone-100">
            Order Control Dashboard
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="flex flex-col gap-6">
            <BotSummary
              bots={bots}
              botLoadLabel={botLoadLabel}
              onAddBot={handleAddBot}
              onRemoveBot={handleRemoveBot}
            />

            <NewOrderControls createOrder={createOrder} />

            <BotActivity
              bots={bots}
              tick={tick}
              orderProgress={orderProgress}
            />
          </section>

          <PendingOrders
            orders={pendingDisplay}
            tick={tick}
            orderProgress={orderProgress}
          />

          <CompletedOrders orders={completedOrders} />
        </div>
      </div>
    </AppLayout>
  );
}

export default App;
