import type { OrderType } from "../types";

type Props = {
  createOrder: (type: OrderType) => void;
};

export function NewOrderControls({ createOrder }: Props) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900/50">
      <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-stone-800 dark:text-stone-200">
        New Order
      </h3>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => createOrder("VIP")}
          className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-yellow-400 px-4 text-sm font-bold leading-normal tracking-[0.015em] text-yellow-900 hover:bg-yellow-500"
        >
          <span className="material-symbols-outlined text-base">star</span>
          <span className="truncate">Add VIP Order</span>
        </button>
        <button
          onClick={() => createOrder("Normal")}
          className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-white hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span className="truncate">Add Normal Order</span>
        </button>
      </div>
    </section>
  );
}
