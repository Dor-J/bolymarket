import { PageContainer } from '@/components/layout/PageContainer';
import { CategoryPageView } from '@/components/category/CategoryPageView';

export default function CryptoPage() {
  return (
    <PageContainer>
      <CategoryPageView tag="crypto" />
    </PageContainer>
  );
}
