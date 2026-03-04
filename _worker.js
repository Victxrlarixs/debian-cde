// Cloudflare Worker for proxying /docs to Mintlify
// This file should be deployed to Cloudflare Pages

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    const urlObject = new URL(request.url);

    // If the request is to the docs subdirectory
    if (/^\/docs/.test(urlObject.pathname)) {
      // Then Proxy to Mintlify
      const DOCS_URL = 'victxrlarixs-debian-cde-48.mintlify.dev';
      const CUSTOM_URL = 'debian.com.mx';

      let url = new URL(request.url);
      url.hostname = DOCS_URL;

      let proxyRequest = new Request(url, request);
      proxyRequest.headers.set('Host', DOCS_URL);
      proxyRequest.headers.set('X-Forwarded-Host', CUSTOM_URL);
      proxyRequest.headers.set('X-Forwarded-Proto', 'https');

      const response = await fetch(proxyRequest);

      // Clone response to modify headers if needed
      const modifiedResponse = new Response(response.body, response);

      // Rewrite any Mintlify URLs in HTML responses
      if (response.headers.get('content-type')?.includes('text/html')) {
        const html = await response.text();
        const rewrittenHtml = html
          .replace(/https:\/\/victxrlarixs-debian-cde-48\.mintlify\.dev/g, 'https://debian.com.mx')
          .replace(/victxrlarixs-debian-cde-48\.mintlify\.dev/g, 'debian.com.mx');

        return new Response(rewrittenHtml, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      }

      return modifiedResponse;
    }
  } catch (error) {
    console.error('Error in worker:', error);
    // If error, continue with normal request
  }

  // For all other requests, fetch normally
  return await fetch(request);
}
