import { PageContainer } from "@/components/layout/PageContainer";
import { FilteredEventList } from "@/components/home/FilteredEventList";

export default function Home() {
  return (
    <PageContainer>
      <h1 className="sr-only">Markets</h1>
      <FilteredEventList />
    </PageContainer>
  );
}
