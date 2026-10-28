// Thin typed fetch helper for the generated `*Data` operation types in `src/api/<backend>/types.gen.ts`.
// The generated type checks url, path params, query and body; the response type is passed explicitly:
//   http.get<CustomerOfferData, CustomerOfferResponses[200]>("/api/crm/customer/{customerId}/offer/{offerId}", {
//     path: { customerId, offerId },
//   });
// The Keycloak bearer token is added here once login exists.

type Operation = {
  body?: unknown;
  path?: Record<string, string | number>;
  query?: Record<string, unknown>;
  url: string;
};

type Request<D extends Operation> = Omit<D, "url"> & { signal?: AbortSignal };

// The request argument is optional only when the operation has no required path, query or body.
type Args<D extends Operation> =
  {} extends Request<D> ? [request?: Request<D>] : [request: Request<D>];

export class ApiError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string) {
    super(`Request failed with status ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function send<R>(
  method: string,
  url: string,
  { path, query, body, signal }: Partial<Operation> & { signal?: AbortSignal } = {},
) {
  const endpoint = url.replace(/\{(\w+)\}/g, (_, key) => encodeURIComponent(String(path?.[key])));
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    for (const item of [value].flat()) {
      if (item != null) search.append(key, String(item));
    }
  }
  const queryString = search.toString();

  const response = await fetch(queryString ? `${endpoint}?${queryString}` : endpoint, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });
  const text = await response.text();
  if (!response.ok) throw new ApiError(response.status, text);
  // ponytail: assumes a JSON (or empty) body; file downloads need their own call when first required.
  return (text ? JSON.parse(text) : undefined) as R;
}

export const http = {
  get: <D extends Operation, R>(url: D["url"], ...[request]: Args<D>) =>
    send<R>("GET", url, request),
  post: <D extends Operation, R>(url: D["url"], ...[request]: Args<D>) =>
    send<R>("POST", url, request),
  put: <D extends Operation, R>(url: D["url"], ...[request]: Args<D>) =>
    send<R>("PUT", url, request),
  delete: <D extends Operation, R>(url: D["url"], ...[request]: Args<D>) =>
    send<R>("DELETE", url, request),
};
