import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChartOutcome, ChartPoint } from '@/lib/chart/types';
import { FeaturedCompactChart } from './FeaturedCompactChart';

const queryResults = vi.hoisted(() => ({
  current: [] as Array<{ isError?: boolean; data?: ChartPoint[] }>,
}));

const liveOutcomesMock = vi.hoisted(() => ({
  current: [] as ChartOutcome[],
}));

const chartMocks = vi.hoisted(() => ({
  generateChartData: vi.fn(),
  mergeChartSeries: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQueries: ({ combine }: { combine: (results: typeof queryResults.current) => unknown }) =>
    combine(queryResults.current),
}));

vi.mock('@/hooks/useLiveChartOutcomes', () => ({
  useLiveChartOutcomes: () => liveOutcomesMock.current,
}));

vi.mock('@/lib/api/queries', () => ({
  priceHistoryQueryOptions: (tokenId: string, timeframe: string) => ({
    queryKey: ['price-history', tokenId, timeframe],
  }),
}));

vi.mock('@/lib/chart/generateChartData', () => ({
  generateChartData: chartMocks.generateChartData,
}));

vi.mock('@/lib/api/clob', () => ({
  mergeChartSeries: chartMocks.mergeChartSeries,
}));

vi.mock('recharts', () => ({
  LineChart: ({
    children,
    data,
  }: {
    children: ReactNode;
    data: ChartPoint[];
  }) => (
    <div data-chart-data={JSON.stringify(data)} data-testid="compact-line-chart">
      {children}
    </div>
  ),
  CartesianGrid: () => <div data-testid="grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Line: ({ dataKey }: { dataKey: string }) => (
    <div data-line-key={dataKey} data-testid="compact-chart-line" />
  ),
}));

class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
}

const baseOutcomes: ChartOutcome[] = [
  { id: 'yes', name: 'Yes', price: 0.6 },
  { id: 'no', name: 'No', price: 0.4 },
];

function getRenderedChartData(): ChartPoint[] {
  const raw = screen
    .getByTestId('compact-line-chart')
    .getAttribute('data-chart-data');
  return raw ? (JSON.parse(raw) as ChartPoint[]) : [];
}

describe('FeaturedCompactChart', () => {
  beforeEach(() => {
    queryResults.current = [];
    liveOutcomesMock.current = baseOutcomes;
    chartMocks.generateChartData.mockReset();
    chartMocks.mergeChartSeries.mockReset();
    chartMocks.generateChartData.mockReturnValue([]);
    chartMocks.mergeChartSeries.mockReturnValue([]);
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 320,
      bottom: 200,
      left: 0,
      width: 320,
      height: 200,
      toJSON: () => ({}),
    });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders nothing when live outcomes are empty', () => {
    liveOutcomesMock.current = [];
    const { container } = render(
      <FeaturedCompactChart eventId="event-1" outcomes={baseOutcomes} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('uses fallback data when history is unavailable', () => {
    const fallback = [{ timestamp: 1, yes: 0.6, no: 0.4 }];
    queryResults.current = [
      { isError: true, data: undefined },
      { isError: false, data: [] },
    ];
    chartMocks.generateChartData.mockReturnValue(fallback);

    render(<FeaturedCompactChart eventId="event-1" outcomes={baseOutcomes} />);

    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(chartMocks.generateChartData).toHaveBeenCalledWith(
      [
        { id: 'yes', name: 'Yes', price: 0.6 },
        { id: 'no', name: 'No', price: 0.4 },
      ],
      '1d',
      'event-1',
    );
    expect(getRenderedChartData()).toEqual(fallback);
  });

  it('merges history and patches the final point with live outcome prices', () => {
    liveOutcomesMock.current = [
      { id: 'yes', name: 'Yes', price: 0.72 },
      { id: 'no', name: 'No', price: 0.28 },
    ];
    queryResults.current = [
      { isError: false, data: [{ timestamp: 1, yes: 0.4 }] },
      { isError: false, data: [{ timestamp: 1, no: 0.6 }] },
    ];
    chartMocks.mergeChartSeries.mockReturnValue([
      { timestamp: 1, yes: 0.4, no: 0.6 },
      { timestamp: 2, yes: 0.5, no: 0.5 },
    ]);

    render(<FeaturedCompactChart eventId="event-1" outcomes={baseOutcomes} />);

    expect(chartMocks.mergeChartSeries).toHaveBeenCalledWith(
      [[{ timestamp: 1, yes: 0.4 }], [{ timestamp: 1, no: 0.6 }]],
      ['yes', 'no'],
    );
    expect(getRenderedChartData()).toEqual([
      { timestamp: 1, yes: 0.4, no: 0.6 },
      { timestamp: 2, yes: 0.72, no: 0.28 },
    ]);
    expect(screen.getAllByTestId('compact-chart-line')).toHaveLength(2);
  });
});
