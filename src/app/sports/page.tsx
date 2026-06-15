import { PageContainer } from '@/components/layout/PageContainer';
import { CategoryPageView } from '@/components/category/CategoryPageView';

export default function SportsPage() {
  return (
    <PageContainer>
      <CategoryPageView tag="sports" />
    </PageContainer>
  );
}
