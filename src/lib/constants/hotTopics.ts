/** Ranked hot topic entry for the home sidebar. */
export interface HotTopicItem {
  rank: number;
  label: string;
  volumeLabel: string;
  href: string;
}

/** Static hot topics list mirroring Polymarket home sidebar. */
export const HOT_TOPICS: HotTopicItem[] = [
  { rank: 1, label: 'Messi', volumeLabel: '$6M', href: '/predictions/messi' },
  { rank: 2, label: 'Georgia', volumeLabel: '$563K', href: '/predictions/georgia' },
  { rank: 3, label: 'Ronaldo', volumeLabel: '$7M', href: '/predictions/ronaldo' },
  { rank: 4, label: 'Fed', volumeLabel: '$66M', href: '/predictions/fed' },
  { rank: 5, label: 'Norway', volumeLabel: '$180M', href: '/predictions/norway' },
];
