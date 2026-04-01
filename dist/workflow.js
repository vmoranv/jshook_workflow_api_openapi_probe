import { createWorkflow, SequenceNodeBuilder, } from '@jshookmcp/extension-sdk/workflow';
const workflowId = 'workflow.api-openapi-probe.v1';
export default createWorkflow(workflowId, 'OpenAPI Probe Batch')
    .description('Probe standard API docs/openapi paths in one burst.')
    .tags(['workflow', 'api', 'openapi', 'probe'])
    .timeoutMs(2 * 60_000)
    .defaultMaxConcurrency(1)
    .buildGraph((ctx) => {
    const baseUrl = ctx.getConfig('workflows.apiProbe.baseUrl', '');
    if (!baseUrl)
        throw new Error('[workflow.api-openapi-probe] Missing required config: workflows.apiProbe.baseUrl');
    const root = new SequenceNodeBuilder('api-openapi-probe-root');
    root.tool('probe-openapi-paths', 'api_probe_batch', {
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
    });
    return root;
})
    .build();
