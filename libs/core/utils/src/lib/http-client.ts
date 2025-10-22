import type { ZodSchema } from 'zod';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpClientConfig {
  baseUrl?: string;
  defaultHeaders?: HeadersInit;
  fetchFn?: typeof fetch;
}

export interface RequestOptions<TResponse> extends Omit<RequestInit, 'body'> {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  schema?: ZodSchema<TResponse>;
  parseJson?: boolean;
}

export class HttpError extends Error {
  constructor(public readonly response: Response, message?: string) {
    super(message ?? `Request failed with status ${response.status}`);
    this.name = 'HttpError';
  }
}

const joinUrl = (baseUrl: string | undefined, path: string): string => {
  if (!baseUrl) {
    return path;
  }

  const normalisedBase = baseUrl.replace(/\/$/, '');
  const normalisedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalisedBase}${normalisedPath}`;
};

const appendQuery = (url: string, query?: Record<string, string | number | boolean | undefined>): string => {
  if (!query || Object.keys(query).length === 0) {
    return url;
  }

  const dummyOrigin = 'http://local';
  const needsDummyOrigin = !/^https?:\/\//i.test(url);
  const target = new URL(url, needsDummyOrigin ? dummyOrigin : undefined);

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    target.searchParams.append(key, String(value));
  });

  if (needsDummyOrigin) {
    return target.href.replace(`${dummyOrigin}`, '');
  }

  return target.toString();
};

const ensureHeaders = (value: HeadersInit | undefined): Headers => {
  if (value instanceof Headers) {
    return value;
  }

  return new Headers(value ?? {});
};

const shouldSerializeBody = (body: unknown, headers: Headers): body is Record<string, unknown> | unknown[] => {
  if (body === undefined || body === null) {
    return false;
  }

  if (typeof body === 'string' || body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer) {
    return false;
  }

  return headers.get('content-type')?.includes('application/json') ?? true;
};

const mergeHeaders = (defaultHeaders: HeadersInit | undefined, requestHeaders: HeadersInit | undefined): Headers => {
  const headers = ensureHeaders(defaultHeaders);

  ensureHeaders(requestHeaders).forEach((value, key) => {
    headers.set(key, value);
  });

  return headers;
};

export const createHttpClient = ({ baseUrl, defaultHeaders, fetchFn }: HttpClientConfig = {}) => {
  const fetchImpl = fetchFn ?? fetch;

  const request = async <TResponse = unknown>(
    path: string,
    { body, schema, query, parseJson, headers: requestHeaders, ...rest }: RequestOptions<TResponse> = {},
    method: HttpMethod = 'GET',
  ): Promise<TResponse> => {
    const urlWithBase = joinUrl(baseUrl, path);
    const finalUrl = appendQuery(urlWithBase, query);
    const headers = mergeHeaders(defaultHeaders, requestHeaders);

    let finalBody: BodyInit | undefined;
    if (shouldSerializeBody(body, headers)) {
      headers.set('content-type', headers.get('content-type') ?? 'application/json');
      finalBody = JSON.stringify(body);
    } else if (typeof body !== 'undefined') {
      finalBody = body as BodyInit;
    }

    const response = await fetchImpl(finalUrl, {
      method,
      body: finalBody,
      headers,
      ...rest,
    });

    if (!response.ok) {
      throw new HttpError(response);
    }

    const responseWantsJson = response.headers.get('content-type')?.includes('application/json');
    const acceptsJson = headers.get('accept')?.includes('application/json');
    const shouldParseJson =
      typeof parseJson === 'boolean' ? parseJson : Boolean(schema) || Boolean(responseWantsJson) || Boolean(acceptsJson);

    if (!shouldParseJson) {
      return undefined as TResponse;
    }

    const data = (await response.json()) as unknown;

    if (schema) {
      return schema.parse(data);
    }

    return data as TResponse;
  };

  const verb = <T = unknown>(method: HttpMethod) => (path: string, options?: RequestOptions<T>) => request<T>(path, options, method);

  return {
    request,
    get: verb('GET'),
    post: verb('POST'),
    put: verb('PUT'),
    patch: verb('PATCH'),
    delete: verb('DELETE'),
  };
};

export type HttpClient = ReturnType<typeof createHttpClient>;
