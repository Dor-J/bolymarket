'use client';

/**
 * Time-window navigation for recurring crypto markets.
 */
export function EventTimeWindowNav() {
  const slots = ['Past', '12:00', '12:05', '12:10', '12:15', 'More'];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {slots.map((slot, index) => (
        <button
          key={slot}
          type="button"
          className={
            index === 2
              ? 'shrink-0 rounded-md bg-brand-subtle px-3 py-1.5 text-sm font-w490 text-brand'
              : 'shrink-0 rounded-md px-3 py-1.5 text-sm font-w490 text-neutral-500 hover:bg-surface-2'
          }
        >
          {slot}
        </button>
      ))}
    </div>
  );
}
