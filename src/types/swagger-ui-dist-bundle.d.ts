declare module 'swagger-ui-dist/swagger-ui-bundle' {
  import type { SwaggerConfigs } from 'swagger-ui-dist';

  /** Prebuilt Swagger UI bundle entry point. */
  function SwaggerUIBundle(config: SwaggerConfigs): unknown;

  export default SwaggerUIBundle;
}
