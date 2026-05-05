const PAGES_ORIGIN = "evermore-life.pages.dev";
const APEX_HOST = "evermorelife.org";

const CLEAN_REDIRECTS = new Map([
  ["/index.html", "/"],
  ["/optin.html", "/optin"],
  ["/get-quote", "/optin"],
  ["/chat.html", "/chat"],
  ["/privacy.html", "/privacy"],
  ["/terms.html", "/terms"],
  ["/thank-you.html", "/thank-you"],
  ["/404.html", "/404"],
  ["/01_website/v2/pages", "/"],
  ["/01_website/v2/pages/", "/"],
  ["/01_website/v2/pages/index", "/"],
  ["/01_website/v2/pages/index.html", "/"],
  ["/01_website/v2/pages/optin", "/optin"],
  ["/01_website/v2/pages/optin.html", "/optin"],
  ["/01_website/v2/pages/chat", "/chat"],
  ["/01_website/v2/pages/chat.html", "/chat"],
  ["/01_website/v2/pages/privacy", "/privacy"],
  ["/01_website/v2/pages/privacy.html", "/privacy"],
  ["/01_website/v2/pages/terms", "/terms"],
  ["/01_website/v2/pages/terms.html", "/terms"],
  ["/01_website/v2/pages/thank-you", "/thank-you"],
  ["/01_website/v2/pages/thank-you.html", "/thank-you"],
]);

const PUBLIC_ROUTES = new Map([
  ["/", "/01_website/v2/pages/"],
  ["/privacy", "/01_website/v2/pages/privacy"],
  ["/terms", "/01_website/v2/pages/terms"],
  ["/optin", "/01_website/v2/pages/optin"],
  ["/chat", "/01_website/v2/pages/chat"],
  ["/thank-you", "/01_website/v2/pages/thank-you"],
  ["/404", "/01_website/v2/pages/404"],
]);

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);

    if (incomingUrl.hostname === `www.${APEX_HOST}`) {
      incomingUrl.hostname = APEX_HOST;
      return Response.redirect(incomingUrl.toString(), 301);
    }

    const cleanPath = CLEAN_REDIRECTS.get(incomingUrl.pathname);
    if (cleanPath) {
      incomingUrl.pathname = cleanPath;
      return Response.redirect(incomingUrl.toString(), 302);
    }

    const upstreamUrl = new URL(request.url);
    upstreamUrl.protocol = "https:";
    upstreamUrl.hostname = PAGES_ORIGIN;
    upstreamUrl.pathname = PUBLIC_ROUTES.get(incomingUrl.pathname) || incomingUrl.pathname;

    const upstreamRequest = new Request(upstreamUrl.toString(), request);
    const response = await fetch(upstreamRequest);

    if (response.status === 404 && !upstreamUrl.pathname.endsWith("/404")) {
      const notFoundUrl = new URL("/01_website/v2/pages/404", upstreamUrl);
      const notFound = await fetch(new Request(notFoundUrl.toString(), request));
      return new Response(rewriteHtml(await notFound.text()), {
        status: 404,
        statusText: "Not Found",
        headers: responseHeaders(notFound.headers, { html: true }),
      });
    }

    if (isHtml(response)) {
      return new Response(rewriteHtml(await response.text()), {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders(response.headers, { html: true }),
      });
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders(response.headers),
    });
  },
};

function isHtml(response) {
  return (response.headers.get("content-type") || "").includes("text/html");
}

function rewriteHtml(html) {
  return html
    .replaceAll('href="_tokens.css"', 'href="/01_website/v2/pages/_tokens.css"')
    .replaceAll('href="_base.css"', 'href="/01_website/v2/pages/_base.css"')
    .replaceAll('src="../assets/', 'src="/01_website/v2/assets/')
    .replaceAll("https://kurrea23.github.io/evermore-life/01_website/v2/assets/", "https://evermorelife.org/01_website/v2/assets/")
    .replaceAll('href="index.html#', 'href="/#')
    .replaceAll('href="index.html"', 'href="/"')
    .replaceAll('href="optin.html"', 'href="/optin"')
    .replaceAll('href="privacy.html"', 'href="/privacy"')
    .replaceAll('href="terms.html"', 'href="/terms"')
    .replaceAll('href="thank-you.html"', 'href="/thank-you"');
}

function responseHeaders(sourceHeaders, options = {}) {
  const headers = new Headers(sourceHeaders);
  headers.set("x-evermore-deployment", "cloudflare-pages-proxy");
  if (options.html) {
    headers.delete("content-length");
    headers.set("content-type", "text/html; charset=utf-8");
  }
  return headers;
}
