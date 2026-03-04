# Mintlify Documentation Proxy

Technical documentation for the Mintlify proxy implementation that serves documentation from `debian.com.mx/docs` without exposing the Mintlify URL.

## Overview

The Mintlify proxy allows the project to host documentation on Mintlify while maintaining a seamless user experience under the main domain. Users access documentation at `debian.com.mx/docs` without seeing `mintlify.dev` URLs.

## Architecture

```
┌─────────────────────────────────────────────┐
│  User Request: debian.com.mx/docs           │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Development: Vite Proxy                    │
│  Production: Cloudflare Worker              │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  victxrlarixs-debian-cde-48.mintlify.dev    │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Response with rewritten URLs               │
│  mintlify.dev → debian.com.mx               │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  User sees: debian.com.mx/docs              │
└─────────────────────────────────────────────┘
```

## Implementation

### Development Environment

**File**: `astro.config.mjs`

Uses Vite's built-in proxy feature to redirect `/docs` requests to Mintlify during development:

```javascript
vite: {
  server: {
    proxy: {
      '/docs': {
        target: 'https://victxrlarixs-debian-cde-48.mintlify.dev',
        changeOrigin: true,
        rewrite: (path) => path,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Host', 'victxrlarixs-debian-cde-48.mintlify.dev');
            proxyReq.setHeader('X-Forwarded-Host', req.headers.host || 'localhost');
            proxyReq.setHeader('X-Forwarded-Proto', 'https');
          });
        },
      },
    },
  },
}
```

**Key Features**:
- `changeOrigin: true` - Modifies the origin header to match the target
- Custom headers - Sets `Host`, `X-Forwarded-Host`, and `X-Forwarded-Proto` for proper routing
- Path preservation - Maintains the original path structure

### Production Environment

**File**: `_worker.js`

Cloudflare Worker that intercepts requests and proxies them to Mintlify:

```javascript
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const urlObject = new URL(request.url);

  if (/^\/docs/.test(urlObject.pathname)) {
    const DOCS_URL = 'victxrlarixs-debian-cde-48.mintlify.dev';
    const CUSTOM_URL = 'debian.com.mx';

    let url = new URL(request.url);
    url.hostname = DOCS_URL;

    let proxyRequest = new Request(url, request);
    proxyRequest.headers.set('Host', DOCS_URL);
    proxyRequest.headers.set('X-Forwarded-Host', CUSTOM_URL);
    proxyRequest.headers.set('X-Forwarded-Proto', 'https');

    const response = await fetch(proxyRequest);

    // Rewrite Mintlify URLs in HTML responses
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

    return response;
  }

  return await fetch(request);
}
```

**Key Features**:
- Pattern matching - Uses regex to detect `/docs` paths
- Header manipulation - Sets proper forwarding headers
- URL rewriting - Replaces Mintlify URLs in HTML responses
- Fallback - Returns original request if not a docs path

## Deployment

### Cloudflare Pages

The `_worker.js` file is automatically detected and deployed by Cloudflare Pages:

1. Place `_worker.js` in the project root
2. Build the project: `npm run build`
3. Cloudflare Pages deploys the worker alongside the static site
4. Worker intercepts requests matching `/docs/*` pattern

### Configuration

**File**: `wrangler.toml`

```toml
name = "debian-cde"
compatibility_date = "2024-01-01"

[env.production]
routes = [
  { pattern = "debian.com.mx/docs/*", zone_name = "debian.com.mx" }
]
```

## Performance Considerations

### Latency

- **Development**: Minimal overhead (~10-20ms) from Vite proxy
- **Production**: ~50-100ms additional latency from Cloudflare Worker hop
- **Caching**: Cloudflare caches responses at edge locations

### Optimization

1. **Edge Caching**: Cloudflare automatically caches static assets
2. **Header Optimization**: Minimal header manipulation for performance
3. **Selective Rewriting**: Only rewrites HTML responses, not assets

## Security

### Headers

The proxy sets security-related headers:

- `X-Forwarded-Host` - Identifies the original host
- `X-Forwarded-Proto` - Ensures HTTPS is maintained
- `Host` - Required for Mintlify routing

### CORS

Mintlify handles CORS based on the `X-Forwarded-Host` header, allowing requests from `debian.com.mx`.

## Troubleshooting

### Common Issues

**Issue**: Documentation not loading in development
- **Cause**: Vite proxy misconfiguration
- **Solution**: Verify `astro.config.mjs` proxy settings

**Issue**: 404 errors in production
- **Cause**: Worker not deployed or inactive
- **Solution**: Check Cloudflare Pages Functions settings

**Issue**: Mintlify URLs visible in production
- **Cause**: URL rewriting not working
- **Solution**: Verify worker is active and check logs

### Debugging

**Development**:
```bash
npm run dev
# Check browser console for proxy errors
# Verify requests to /docs are proxied
```

**Production**:
1. Cloudflare Dashboard → Workers & Pages → Project
2. View Logs for worker execution
3. Check Functions tab for worker status

## Alternative Approaches

### Custom Domain (Mintlify Pro)

Instead of proxying, use Mintlify's custom domain feature:

**Pros**:
- No proxy overhead
- Direct connection to Mintlify
- Simpler setup

**Cons**:
- Requires paid Mintlify plan
- Uses subdomain (`docs.debian.com.mx`) instead of path (`/docs`)
- Less control over routing

### Reverse Proxy (Nginx/Apache)

Use a traditional reverse proxy:

**Pros**:
- Full control over routing
- Can add custom middleware
- Works with any hosting

**Cons**:
- Requires server infrastructure
- More complex setup
- Higher maintenance

## Future Improvements

1. **Response Caching**: Implement worker-level caching for faster responses
2. **Asset Optimization**: Proxy and optimize Mintlify assets
3. **Analytics**: Track documentation usage through worker
4. **A/B Testing**: Test different documentation versions

## Related Documentation

- [Architecture Overview](architecture.md) - System architecture
- [Storage & Cache](storage.md) - Caching strategies
- [Contributing Guide](../../CONTRIBUTING.md) - Development workflow
