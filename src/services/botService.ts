export const botTimers = new Map<number, number>();

export function clearBotTimer(botId: number) {
  const timer = botTimers.get(botId);
  if (timer) {
    clearTimeout(timer);
    botTimers.delete(botId);
  }
}

export function scheduleBotTask(
  botId: number,
  callback: () => void,
  duration: number
) {
  clearBotTimer(botId);
  const timerId = setTimeout(callback, duration);
  botTimers.set(botId, timerId);
}

export function clearAllBotTimers() {
  botTimers.forEach(clearTimeout);
  botTimers.clear();
}
