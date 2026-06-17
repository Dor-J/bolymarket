'use client';

const TABS = ['Comments', 'Top Holders', 'Positions', 'Activity'] as const;

/**
 * Visual discussion/activity tabs matching Polymarket layout.
 */
export function EventDiscussionTabs() {
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <div className="flex gap-4 overflow-x-auto border-b border-border">
        {TABS.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={
              index === 0
                ? 'border-b-2 border-brand pb-2 text-sm font-semibold text-text'
                : 'pb-2 text-sm font-w490 text-neutral-500'
            }
          >
            {tab}
          </button>
        ))}
      </div>
      <p className="py-8 text-center text-sm text-neutral-500">
        Sign in to view discussion and activity
      </p>
    </section>
  );
}
