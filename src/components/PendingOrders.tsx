import type { Order } from "../types";
import { formatTime } from "../utils/time";

type Props = {
  orders: Order[];
  tick: number;
  orderProgress: (order: Order, now: number) => number;
};

export function PendingOrders({ orders, tick, orderProgress }: Props) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-stone-100 p-4 dark:border-stone-800/80 dark:bg-stone-900/70">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-stone-900 dark:text-stone-100">
          Pending Orders
        </h3>
        <span className="inline-flex items-center justify-center rounded-full bg-primary/20 px-2.5 py-0.5 text-sm font-semibold text-primary dark:bg-primary/30 dark:text-primary/90">
          {orders.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {orders.length === 0 && (
          <p className="rounded-lg border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-400">
            No orders waiting. Create a Normal or VIP order to start.
          </p>
        )}
        {orders.map((order) => {
          const isVip = order.type === "VIP";
          const isProcessing = order.status === "PROCESSING";
          const cardBorder = isVip
            ? "border-2 border-yellow-400"
            : "border border-stone-200 dark:border-stone-700";
          const progress =
            isProcessing && order.startedAt ? orderProgress(order, tick) : 0;
          const statusLabel = isProcessing
            ? `Processing (Bot ${order.botId})`
            : "Queued";

          return (
            <div
              key={order.id}
              className={`rounded-lg bg-white p-4 shadow-sm dark:bg-stone-800 ${cardBorder} ${
                isVip ? "shadow-md" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                    #{order.id}
                  </p>
                  <span
                    className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
                      isVip
                        ? "bg-yellow-400/20 text-yellow-600 dark:text-yellow-400"
                        : "bg-stone-500/20 text-stone-600 dark:text-stone-400"
                    }`}
                  >
                    {order.type}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {formatTime(order.createdAt)}
                </p>
              </div>

              <div className="mt-3">
                <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
                  Status: {statusLabel}
                </p>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-stone-200 dark:bg-stone-700">
                  <div
                    className={`${
                      isProcessing ? "bg-primary" : "bg-stone-400"
                    } h-1.5 rounded-full`}
                    style={{ width: `${isProcessing ? progress : 10}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
