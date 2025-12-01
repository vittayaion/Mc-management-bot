import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background-light font-display text-stone-900 antialiased dark:bg-background-dark dark:text-stone-100">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="flex flex-1">
          <aside className="flex w-64 flex-col gap-4 border-r border-stone-200/80 bg-white p-4 dark:border-stone-800/80 dark:bg-background-dark">
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNFKIaGOB5F5v-suQo0PA-_00tSa06Irbf7oMbfD3rbQxjYJyG6_29HYuL91rwJ3aJs11dzSbaTuUbOrI8-M4jfNZvVeAV3RLDIAq5KHdsr0MoSpu-HNSdLfI57x4Lqh9jq1Kyx-GCdmf6mLvWfx5pNWgbtAYPrtw74dlf8ZMTUtUA7fOku59Q5BsTjgNVo3ttAIuseFC1r4HvgsEZU-IBEfI1glt5ArmwIQUv_RWzWb2oJW4gtAPzuAOociWw3aWFYYpjNBcoLfs")',
                }}
              />
              <div className="flex flex-col">
                <p className="text-base font-bold leading-normal text-stone-900 dark:text-stone-100">
                  McD&apos;s Bot
                </p>
                <p className="text-sm font-normal leading-normal text-green-600 dark:text-green-400">
                  System Online
                </p>
              </div>
            </div>

            <nav className="mt-4 flex flex-col gap-2">
              <span className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 dark:bg-primary/20">
                <span className="material-symbols-outlined text-2xl text-primary">
                  dashboard
                </span>
                <span className="text-sm font-bold leading-normal text-primary">
                  Dashboard
                </span>
              </span>
            </nav>
          </aside>

          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
