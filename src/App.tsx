import { useEffect, useMemo, useRef } from "react";
import { AppLayout } from "./components/AppLayout";
import { BotActivity } from "./components/BotActivity";
import { BotSummary } from "./components/BotSummary";
import { CompletedOrders } from "./components/CompletedOrders";
import { PendingOrders } from "./components/PendingOrders";
import { NewOrderControls } from "./components/NewOrderControls";
import { useBots } from "./hooks/useBots";
import { useOrders } from "./hooks/useOrders";
import { useTick } from "./hooks/useTick";
import {
  PROCESS_DURATION,
  insertOrder,
  orderProgress,
} from "./services/orderService";
import { clearAllBotTimers } from "./services/botService";
import { BotStatus, OrderStatus } from "./types";
import type { Order } from "./types";

function App() {
  const tick = useTick();
  const {
    pendingOrders,
    completedOrders,
    createOrder,
    markOrderComplete,
    setPendingOrders,
  } = useOrders();
  const { bots, addBot, updateBots, scheduleBotTimer, clearBotTimer } =
    useBots();

  const completedOrderIdsRef = useRef<Set<number>>(new Set());
  const canceledOrderIdsRef = useRef<Set<number>>(new Set());

  const completeOrder = (botId: number, orderId: number) => {
    if (canceledOrderIdsRef.current.has(orderId)) {
      clearBotTimer(botId);
      canceledOrderIdsRef.current.delete(orderId);
      updateBots((prevBots) =>
        prevBots.map((b) =>
          b.id === botId ? { id: b.id, status: BotStatus.Idle } : b
        )
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
      status: OrderStatus.Complete,
      completedAt: Date.now(),
    };

    completedOrderIdsRef.current.add(orderId);
    clearBotTimer(botId);

    updateBots((prevBots) =>
      prevBots.map((b) =>
        b.id === botId ? { id: b.id, status: BotStatus.Idle } : b
      )
    );
    markOrderComplete(finishedOrder);
  };

  const scheduleOrderCompletion = (botId: number, orderId: number) => {
    scheduleBotTimer(
      botId,
      () => completeOrder(botId, orderId),
      PROCESS_DURATION
    );
  };

  useEffect(() => {
    return () => {
      clearAllBotTimers();
    };
  }, []);

  useEffect(() => {
    bots.forEach((bot) => {
      const order = bot.currentOrder;
      if (bot.status !== BotStatus.Processing || !order?.startedAt) return;
      const elapsed = tick - order.startedAt;
      if (elapsed >= PROCESS_DURATION) {
        completeOrder(bot.id, order.id);
      }
    });
  }, [bots, tick]);

  useEffect(() => {
    const idleBots = bots.filter((bot) => bot.status === BotStatus.Idle);
    if (!idleBots.length || !pendingOrders.length) return;

    const pendingQueue = [...pendingOrders];
    const nextBots = bots.map((bot) => ({ ...bot }));
    let hasAssignedOrders = false;

    idleBots.forEach((bot) => {
      if (!pendingQueue.length) return;
      const nextOrder = pendingQueue.shift()!;
      const startedAt = Date.now();
      const processingOrder: Order = {
        ...nextOrder,
        status: OrderStatus.Processing,
        startedAt,
        botId: bot.id,
      };
      canceledOrderIdsRef.current.delete(nextOrder.id);
      const botIndex = nextBots.findIndex((b) => b.id === bot.id);
      nextBots[botIndex] = {
        id: bot.id,
        status: BotStatus.Processing,
        currentOrder: processingOrder,
      };
      scheduleOrderCompletion(bot.id, processingOrder.id);
      hasAssignedOrders = true;
    });

    if (hasAssignedOrders) {
      updateBots(() => nextBots);
      setPendingOrders(pendingQueue);
    }
  }, [bots, pendingOrders]);

  const handleRemoveBot = () => {
    updateBots((prevBots) => {
      if (!prevBots.length) return prevBots;
      const botToRemove = prevBots[prevBots.length - 1];

      clearBotTimer(botToRemove.id);

      if (botToRemove.status === BotStatus.Processing && botToRemove.currentOrder) {
        const resetOrder: Order = {
          ...botToRemove.currentOrder,
          status: OrderStatus.Pending,
          startedAt: undefined,
          botId: undefined,
        };
        canceledOrderIdsRef.current.add(botToRemove.currentOrder.id);
        setPendingOrders((prev) => {
          const withoutDupes = prev.filter(
            (order) => order.id !== resetOrder.id
          );
          return insertOrder(withoutDupes, resetOrder);
        });
      }

      return prevBots.slice(0, -1);
    });
  };

  const processingOrders = useMemo(
    () =>
      bots
        .map((bot) => bot.currentOrder)
        .filter((order): order is Order => Boolean(order)),
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
              onAddBot={addBot}
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
