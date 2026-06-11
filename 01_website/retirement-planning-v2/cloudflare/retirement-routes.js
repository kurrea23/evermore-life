const PAGES_ORIGIN = "evermore-life.pages.dev";
const ROUTES = new Map([
  ["/retirement", "/01_website/retirement-planning-v2/pages/"],
  ["/retirement/", "/01_website/retirement-planning-v2/pages/"],
  ["/retirement/review", "/01_website/retirement-planning-v2/pages/optin"],
  ["/retirement/review/", "/01_website/retirement-planning-v2/pages/optin"],
  ["/retirement/chat", "/01_website/retirement-planning-v2/pages/chat"],
  ["/retirement/chat/", "/01_website/retirement-planning-v2/pages/chat"],
  ["/retirement/sarah", "/01_website/retirement-planning-v2/pages/sarah"],
  ["/retirement/sarah/", "/01_website/retirement-planning-v2/pages/sarah"],
  ["/retirement/privacy", "/01_website/retirement-planning-v2/pages/privacy"],
  ["/retirement/privacy/", "/01_website/retirement-planning-v2/pages/privacy"],
  ["/retirement/terms", "/01_website/retirement-planning-v2/pages/terms"],
  ["/retirement/terms/", "/01_website/retirement-planning-v2/pages/terms"],
  ["/retirement/thank-you", "/01_website/retirement-planning-v2/pages/thank-you"],
  ["/retirement/thank-you/", "/01_website/retirement-planning-v2/pages/thank-you"],
]);

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);
    if (incomingUrl.hostname === "www.evermorelife.org") {
      incomingUrl.hostname = "evermorelife.org";
      return Response.redirect(incomingUrl.toString(), 301);
    }

    if (incomingUrl.pathname.startsWith("/retirement") && !ROUTES.has(incomingUrl.pathname)) {
      const notFoundUrl = new URL(`https://${PAGES_ORIGIN}/01_website/retirement-planning-v2/pages/404`);
      const notFound = await fetch(new Request(notFoundUrl.toString(), request));
      return htmlResponse(rewriteHtml(await notFound.text()), notFound.headers, 404, "Not Found");
    }

    const upstreamUrl = new URL(request.url);
    upstreamUrl.protocol = "https:";
    upstreamUrl.hostname = PAGES_ORIGIN;
    upstreamUrl.pathname = ROUTES.get(incomingUrl.pathname) || incomingUrl.pathname;

    const response = await fetch(new Request(upstreamUrl.toString(), request));
    if (response.status === 404 && !upstreamUrl.pathname.endsWith("/404")) {
      const notFoundUrl = new URL("/01_website/retirement-planning-v2/pages/404", upstreamUrl);
      const notFound = await fetch(new Request(notFoundUrl.toString(), request));
      return htmlResponse(rewriteHtml(await notFound.text()), notFound.headers, 404, "Not Found");
    }

    if (isHtml(response)) {
      return htmlResponse(
        rewriteHtml(await response.text()),
        response.headers,
        response.status,
        response.statusText,
      );
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: publicHeaders(response.headers),
    });
  },
};

function isHtml(response) {
  return (response.headers.get("content-type") || "").includes("text/html");
}

function rewriteHtml(html) {
  return html
    .replaceAll('href="_tokens.css"', 'href="/01_website/retirement-planning-v2/pages/_tokens.css"')
    .replaceAll('href="_base.css"', 'href="/01_website/retirement-planning-v2/pages/_base.css"')
    .replaceAll('src="../assets/', 'src="/01_website/retirement-planning-v2/assets/')
    .replaceAll('href="index.html#', 'href="/retirement#')
    .replaceAll('href="index.html"', 'href="/retirement"')
    .replaceAll('href="optin.html"', 'href="/retirement/review"')
    .replaceAll('href="privacy.html"', 'href="/retirement/privacy"')
    .replaceAll('href="terms.html"', 'href="/retirement/terms"')
    .replaceAll('href="thank-you.html"', 'href="/retirement/thank-you"')
    .replaceAll('href="/privacy"', 'href="/retirement/privacy"')
    .replaceAll('href="/terms"', 'href="/retirement/terms"');
}

function htmlResponse(html, sourceHeaders, status, statusText) {
  const headers = publicHeaders(sourceHeaders);
  headers.delete("content-length");
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("x-robots-tag", "noindex, nofollow");
  return new Response(html, { status, statusText, headers });
}

function publicHeaders(sourceHeaders) {
  const headers = new Headers(sourceHeaders);
  headers.set("x-evermore-deployment", "cloudflare-retirement-routes");
  return headers;
}
