import { PageContainer } from '@/components/layout/PageContainer';
import { EventsGrid } from '@/components/home/EventsGrid';

export default function Home() {
  return (
    <PageContainer>
      <h1 className="sr-only">Markets</h1>
      <EventsGrid />
    </PageContainer>
  );
}
