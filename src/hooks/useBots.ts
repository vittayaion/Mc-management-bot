import { useState } from "react";
import { clearBotTimer, scheduleBotTask } from "../services/botService";
import { BotStatus } from "../types";
import type { Bot, Order } from "../types";

type BotsUpdater = (prev: Bot[]) => Bot[];

export function useBots() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [nextId, setNextId] = useState(1);

  const addBot = () => {
    setBots((prev) => [...prev, { id: nextId, status: BotStatus.Idle }]);
    setNextId((id) => id + 1);
  };

  const removeLastBot = () => {
    setBots((prev) => (prev.length ? prev.slice(0, -1) : prev));
  };

  const setBotProcessing = (id: number, order: Order) => {
    setBots((prev) =>
      prev.map((b) =>
        b.id === id
          ? { id, status: BotStatus.Processing, currentOrder: order }
          : b
      )
    );
  };

  const setBotIdle = (id: number) => {
    setBots((prev) =>
      prev.map((b) => (b.id === id ? { id, status: BotStatus.Idle } : b))
    );
  };

  const updateBots = (updater: BotsUpdater) => setBots(updater);

  return {
    bots,
    addBot,
    removeLastBot,
    setBotProcessing,
    setBotIdle,
    updateBots,
    scheduleBotTimer: scheduleBotTask,
    clearBotTimer,
  };
}
