import type {Route} from './+types/jobs.run';

const SHOPIFY_API_VERSION = '2025-01';

export async function action({request, context}: Route.ActionArgs) {
  const token = (request.headers.get('authorization') ?? '').split(' ')[1];
  const {JOB_SECRET, SHOPIFY_ADMIN_TOKEN, PUBLIC_STORE_DOMAIN} = context.env;

  if (!JOB_SECRET || token !== JOB_SECRET) {
    return new Response(JSON.stringify({error: 'Unauthorized'}), {
      status: 401,
      headers: {'Content-Type': 'application/json'},
    });
  }

  const url = `https://${PUBLIC_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
    },
    body: JSON.stringify({
      query: `query { products(first: 5) { edges { node { id title } } } }`,
    }),
  });

  const data = await resp.json();

  if (!resp.ok || (data as any).errors) {
    return new Response(JSON.stringify({error: data}), {
      status: 502,
      headers: {'Content-Type': 'application/json'},
    });
  }

  return new Response(JSON.stringify({ok: true, result: (data as any).data}), {
    headers: {'Content-Type': 'application/json'},
  });
}
