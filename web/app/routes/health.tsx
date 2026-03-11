import type {Route} from './+types/health';

export async function loader(_: Route.LoaderArgs) {
  return new Response('ok', {status: 200});
}
