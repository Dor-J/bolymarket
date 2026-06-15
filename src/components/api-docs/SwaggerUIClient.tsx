'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export interface SwaggerUIClientProps {
  specUrl: string;
}

/**
 * Interactive Swagger UI explorer for the bolymarket REST API.
 */
export function SwaggerUIClient({ specUrl }: SwaggerUIClientProps) {
  const plugins = useMemo(() => [], []);

  return (
    <SwaggerUI
      url={specUrl}
      docExpansion="list"
      defaultModelsExpandDepth={2}
      defaultModelExpandDepth={2}
      displayOperationId
      displayRequestDuration
      filter
      showExtensions
      showCommonExtensions
      tryItOutEnabled
      deepLinking
      persistAuthorization
      plugins={plugins}
      requestInterceptor={(request) => {
        request.headers.Accept = 'application/json';
        return request;
      }}
    />
  );
}
