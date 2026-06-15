import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";

export default function EventNotFound() {
  return (
    <PageContainer className="max-w-[1320px]">
      <div className="rounded-card border border-border bg-card p-8 text-center">
        <h1 className="text-xl font-semibold text-text">Event not found</h1>
        <p className="mt-2 text-sm text-muted">
          This market does not exist or may have closed.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline"
        >
          Back to markets
        </Link>
      </div>
    </PageContainer>
  );
}
