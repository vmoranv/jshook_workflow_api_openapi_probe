/**
 * Local extension workflow: probe common OpenAPI/Swagger endpoints.
 */
function toolNode(id, toolName, options) {
  return {
    kind: 'tool',
    id,
    toolName,
    input: options?.input,
    retry: options?.retry,
    timeoutMs: options?.timeoutMs,
  };
}

function sequenceNode(id, steps) {
  return { kind: 'sequence', id, steps };
}

/** @type {import('../../dist/src/server/workflows/WorkflowContract.js').WorkflowContract} */
const apiOpenapiProbeWorkflow = {
  kind: 'workflow-contract',
  version: 1,
  id: 'workflow.api-openapi-probe.v1',
  displayName: 'OpenAPI Probe Batch',
  description: 'Probe standard API docs/openapi paths in one burst.',
  tags: ['workflow', 'api', 'openapi', 'probe'],
  timeoutMs: 2 * 60_000,
  defaultMaxConcurrency: 1,

  build(ctx) {
    const baseUrl = ctx.getConfig('workflows.apiProbe.baseUrl', '');
    if (!baseUrl) throw new Error('[workflow.api-openapi-probe] Missing required config: workflows.apiProbe.baseUrl');
    return sequenceNode('api-openapi-probe-root', [
      toolNode('probe-openapi-paths', 'api_probe_batch', {
        input: {
          baseUrl,
          method: 'GET',
          paths: [
            '/docs',
            '/openapi.json',
            '/api/docs',
            '/swagger.json',
            '/api/v1/openapi.json',
            '/api/openapi.json',
          ],
          includeBodyStatuses: [200, 201, 204],
          maxBodySnippetLength: 800,
          autoInjectAuth: true,
        },
      }),
    ]);
  },
};

export default apiOpenapiProbeWorkflow;
