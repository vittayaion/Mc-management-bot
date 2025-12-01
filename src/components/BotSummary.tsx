import type { Bot } from "../types";

type Props = {
  bots: Bot[];
  botLoadLabel: string;
  onAddBot: () => void;
  onRemoveBot: () => void;
};

export function BotSummary({ bots, botLoadLabel, onAddBot, onRemoveBot }: Props) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900/50">
      <p className="text-base font-medium leading-normal text-stone-800 dark:text-stone-200">
        Bots
      </p>
      <p className="text-5xl font-bold leading-tight tracking-tight text-stone-900 dark:text-stone-100">
        {bots.length}
        <span className="text-2xl text-stone-400 dark:text-stone-500">
          &nbsp;active
        </span>
      </p>
      <p className="text-sm text-stone-500 dark:text-stone-400">{botLoadLabel}</p>
      <div className="flex gap-3">
        <button
          onClick={onRemoveBot}
          className="flex h-10 min-w-[84px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-stone-100 px-4 text-xl font-bold leading-normal tracking-[0.015em] text-stone-800 hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
          disabled={!bots.length}
        >
          <span className="material-symbols-outlined text-lg">remove</span>
          <span className="sr-only">Remove Bot</span>
        </button>
        <button
          onClick={onAddBot}
          className="flex h-10 min-w-[84px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-stone-100 px-4 text-xl font-bold leading-normal tracking-[0.015em] text-stone-800 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span className="sr-only">Add Bot</span>
        </button>
      </div>
    </section>
  );
}
