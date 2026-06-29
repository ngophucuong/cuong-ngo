export function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('content-type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function html(markup, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('content-type', 'text/html; charset=utf-8');
  return new Response(markup, { ...init, headers });
}

export function error(message, status = 400, extra = {}) {
  return json({ ok: false, error: message, ...extra }, { status });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function withCors(response, origin = '*') {
  const headers = new Headers(response.headers);
  headers.set('access-control-allow-origin', origin);
  headers.set('access-control-allow-methods', 'POST, OPTIONS');
  headers.set('access-control-allow-headers', 'content-type');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
