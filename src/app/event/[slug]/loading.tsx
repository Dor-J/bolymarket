import { PageContainer } from "@/components/layout/PageContainer";
import { EventDetailSkeleton } from "@/components/event/EventDetailSkeleton";

export default function EventLoading() {
  return (
    <PageContainer className="max-w-[1320px]">
      <EventDetailSkeleton />
    </PageContainer>
  );
}
