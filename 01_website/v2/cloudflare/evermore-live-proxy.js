const PAGES_ORIGIN = "evermore-life.pages.dev";
const APEX_HOST = "evermorelife.org";

const CANONICAL_PATHS = new Map([
  ["/", "/01_website/v2/pages/"],
  ["/index.html", "/01_website/v2/pages/"],
  ["/privacy", "/01_website/v2/pages/privacy"],
  ["/privacy.html", "/01_website/v2/pages/privacy"],
  ["/terms", "/01_website/v2/pages/terms"],
  ["/terms.html", "/01_website/v2/pages/terms"],
  ["/optin", "/01_website/v2/pages/optin"],
  ["/optin.html", "/01_website/v2/pages/optin"],
  ["/thank-you", "/01_website/v2/pages/thank-you"],
  ["/thank-you.html", "/01_website/v2/pages/thank-you"],
  ["/404.html", "/01_website/v2/pages/404"],
]);

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);

    if (incomingUrl.hostname === `www.${APEX_HOST}`) {
      incomingUrl.hostname = APEX_HOST;
      return Response.redirect(incomingUrl.toString(), 301);
    }

    const canonicalPath = CANONICAL_PATHS.get(incomingUrl.pathname);
    if (canonicalPath) {
      incomingUrl.pathname = canonicalPath;
      return Response.redirect(incomingUrl.toString(), 302);
    }

    const upstreamUrl = new URL(request.url);
    upstreamUrl.protocol = "https:";
    upstreamUrl.hostname = PAGES_ORIGIN;

    const upstreamRequest = new Request(upstreamUrl.toString(), request);
    const response = await fetch(upstreamRequest);

    if (response.status === 404 && !upstreamUrl.pathname.endsWith("/404")) {
      const notFoundUrl = new URL("/01_website/v2/pages/404", upstreamUrl);
      const notFound = await fetch(new Request(notFoundUrl.toString(), request));
      return new Response(notFound.body, {
        status: 404,
        statusText: "Not Found",
        headers: responseHeaders(notFound.headers),
      });
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders(response.headers),
    });
  },
};

function responseHeaders(sourceHeaders) {
  const headers = new Headers(sourceHeaders);
  headers.set("x-evermore-deployment", "cloudflare-pages-proxy");
  return headers;
}
