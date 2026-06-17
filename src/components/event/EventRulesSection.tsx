'use client';

export interface EventRulesSectionProps {
  description?: string;
}

/**
 * Rules section for event detail pages.
 */
export function EventRulesSection({ description }: EventRulesSectionProps) {
  if (!description) {
    return null;
  }

  return (
    <section className="space-y-2 border-t border-border pt-6">
      <h2 className="text-base leading-6 font-semibold text-text">Rules</h2>
      <p className="text-sm leading-5 text-neutral-500 whitespace-pre-wrap">
        {description}
      </p>
    </section>
  );
}
