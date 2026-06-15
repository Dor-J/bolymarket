import { PageContainer } from "@/components/layout/PageContainer";
import { EventDetailPage } from "@/components/event/EventDetailPage";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;

  return (
    <PageContainer className="max-w-[1320px]">
      <EventDetailPage slug={slug} />
    </PageContainer>
  );
}
