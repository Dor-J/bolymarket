import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChartPoint } from '@/lib/chart/types';
import { PriceChart } from './PriceChart';

const queryResults = vi.hoisted(() => ({
  current: [] as Array<{ isError?: boolean; data?: ChartPoint[] }>,
}));

const chartMocks = vi.hoisted(() => ({
  generateChartData: vi.fn(),
  mergeChartSeries: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQueries: ({ combine }: { combine: (results: typeof queryResults.current) => unknown }) =>
    combine(queryResults.current),
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
  ResponsiveContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({
    children,
    data,
  }: {
    children: ReactNode;
    data: ChartPoint[];
  }) => (
    <div data-chart-data={JSON.stringify(data)} data-testid="line-chart">
      {children}
    </div>
  ),
  CartesianGrid: () => <div data-testid="grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Line: ({ dataKey }: { dataKey: string }) => (
    <div data-line-key={dataKey} data-testid="chart-line" />
  ),
}));

const outcomes = [
  { id: 'yes', name: 'Yes', price: 0.55 },
  { id: 'no', name: 'No', price: 0.45 },
];

function getRenderedChartData(): ChartPoint[] {
  const raw = screen.getByTestId('line-chart').getAttribute('data-chart-data');
  return raw ? (JSON.parse(raw) as ChartPoint[]) : [];
}

describe('PriceChart', () => {
  beforeEach(() => {
    queryResults.current = [];
    chartMocks.generateChartData.mockReset();
    chartMocks.mergeChartSeries.mockReset();
    chartMocks.generateChartData.mockReturnValue([]);
    chartMocks.mergeChartSeries.mockReturnValue([]);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders nothing when no outcomes are available', () => {
    const { container } = render(
      <PriceChart eventId="event-1" outcomes={[]} timeframe="1d" />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('uses generated fallback data when history queries fail or are empty', () => {
    const fallback = [{ timestamp: 1, yes: 0.4, no: 0.6 }];
    queryResults.current = [
      { isError: true, data: undefined },
      { isError: false, data: [] },
    ];
    chartMocks.generateChartData.mockReturnValue(fallback);

    render(<PriceChart eventId="event-1" outcomes={outcomes} timeframe="1d" />);

    expect(chartMocks.generateChartData).toHaveBeenCalledWith(
      [
        { id: 'yes', name: 'Yes', price: 0.55 },
        { id: 'no', name: 'No', price: 0.45 },
      ],
      '1d',
      'event-1',
    );
    expect(getRenderedChartData()).toEqual(fallback);
  });

  it('merges historical series and patches the final point with live prices', () => {
    queryResults.current = [
      { isError: false, data: [{ timestamp: 1, yes: 0.2 }] },
      { isError: false, data: [{ timestamp: 1, no: 0.8 }] },
    ];
    chartMocks.mergeChartSeries.mockReturnValue([
      { timestamp: 1, yes: 0.2, no: 0.8 },
      { timestamp: 2, yes: 0.3, no: 0.7 },
    ]);

    render(<PriceChart eventId="event-1" outcomes={outcomes} timeframe="1d" />);

    expect(chartMocks.mergeChartSeries).toHaveBeenCalledWith(
      [[{ timestamp: 1, yes: 0.2 }], [{ timestamp: 1, no: 0.8 }]],
      ['yes', 'no'],
    );
    expect(getRenderedChartData()).toEqual([
      { timestamp: 1, yes: 0.2, no: 0.8 },
      { timestamp: 2, yes: 0.55, no: 0.45 },
    ]);
    expect(screen.getAllByTestId('chart-line')).toHaveLength(2);
  });
});
