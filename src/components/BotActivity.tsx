import type { Bot, Order } from "../types";

type Props = {
  bots: Bot[];
  tick: number;
  orderProgress: (order: Order, now: number) => number;
};

export function BotActivity({ bots, tick, orderProgress }: Props) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900/50">
      <h3 className="text-base font-semibold text-stone-800 dark:text-stone-100">
        Bot Activity
      </h3>
      {bots.length === 0 && (
        <p className="text-sm text-stone-500 dark:text-stone-400">
          No bots yet. Add one to start cooking.
        </p>
      )}
      {bots.map((bot) => {
        const order = bot.currentOrder;
        const progress =
          bot.status === "PROCESSING" && order ? orderProgress(order, tick) : 0;
        return (
          <div
            key={bot.id}
            className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800/70"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                Bot #{bot.id}
              </p>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                  bot.status === "PROCESSING"
                    ? "bg-primary/15 text-primary"
                    : "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200"
                }`}
              >
                {bot.status === "PROCESSING" ? "Processing" : "Idle"}
              </span>
            </div>
            {order ? (
              <div className="mt-2">
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Order #{order.id} • {order.type}
                </p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-stone-200 dark:bg-stone-700">
                  <div
                    className="h-1.5 rounded-full bg-primary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                Waiting for next order
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}
