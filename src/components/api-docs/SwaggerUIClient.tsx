'use client';

import { useEffect, useRef } from 'react';
import type { OpenAPIV3 } from 'openapi-types';
import type { SwaggerConfigs } from 'swagger-ui-dist';
import 'swagger-ui-dist/swagger-ui.css';

export interface SwaggerUIClientProps {
  spec: OpenAPIV3.Document;
}

/**
 * Interactive Swagger UI explorer using the prebuilt swagger-ui-dist bundle.
 * Avoids swagger-ui-react + Turbopack OpenAPI 3.1 parser issues.
 */
export function SwaggerUIClient({ spec }: SwaggerUIClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let cancelled = false;

    void import('swagger-ui-dist/swagger-ui-bundle').then((module) => {
      if (cancelled) {
        return;
      }

      const SwaggerUIBundle = module.default;

      SwaggerUIBundle({
        spec,
        domNode: container,
        docExpansion: 'list',
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        displayOperationId: true,
        displayRequestDuration: true,
        filter: true,
        tryItOutEnabled: true,
        deepLinking: true,
        persistAuthorization: true,
        requestInterceptor: ((request) => {
          if (request.headers) {
            request.headers.Accept = 'application/json';
          }
          return request;
        }) as SwaggerConfigs['requestInterceptor'],
      });
    });

    return () => {
      cancelled = true;
      container.innerHTML = '';
    };
  }, [spec]);

  return <div ref={containerRef} className="swagger-ui-wrap" />;
}
