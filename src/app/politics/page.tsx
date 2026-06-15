import { PageContainer } from '@/components/layout/PageContainer';
import { CategoryPageView } from '@/components/category/CategoryPageView';

export default function PoliticsPage() {
  return (
    <PageContainer>
      <CategoryPageView tag="politics" />
    </PageContainer>
  );
}
