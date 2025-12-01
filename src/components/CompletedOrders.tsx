import type { Order } from "../types";
import { formatTime } from "../utils/time";

type Props = {
  orders: Order[];
};

export function CompletedOrders({ orders }: Props) {
  const ordered = [...orders].reverse();

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-stone-100 p-4 dark:border-stone-800/80 dark:bg-stone-900/70">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-stone-900 dark:text-stone-100">
          Completed Orders
        </h3>
        <span className="inline-flex items-center justify-center rounded-full bg-green-500/20 px-2.5 py-0.5 text-sm font-semibold text-green-600 dark:bg-green-500/30 dark:text-green-400">
          {orders.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {orders.length === 0 && (
          <p className="rounded-lg border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-400">
            Completed orders will appear here after 10 seconds of processing.
          </p>
        )}
        {ordered.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm opacity-80 dark:border-stone-700 dark:bg-stone-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  #{order.id}
                </p>
                <span
                  className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
                    order.type === "VIP"
                      ? "bg-yellow-400/20 text-yellow-600 dark:text-yellow-400"
                      : "bg-stone-500/20 text-stone-600 dark:text-stone-400"
                  }`}
                >
                  {order.type}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-green-500">
                  check_circle
                </span>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {order.completedAt ? formatTime(order.completedAt) : "--"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
