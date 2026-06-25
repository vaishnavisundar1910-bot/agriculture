src/server/entry.ts [379 lines]
     1|import express, { type Express, type NextFunction, type Request, type Response } from "express";
     2|import { fileURLToPath } from "node:url";
     3|import { dirname, extname, join } from "node:path";
     4|import { readFileSync } from "node:fs";
     5|
     6|// <api-imports>
     7|import healthGet from "./api/health/GET";
     8|// </api-imports>
     9|import { seoRoutes } from "../lib/seo-routes";
    10|import {
    11|	loadAdSenseRuntimeConfig,
    12|	resolveAdSenseTextFile,
    13|	type AdSenseRuntimeConfig,
    14|} from "./adsense-manifest";
    15|import { isSystemHost } from "./seo-host";
    16|import { llmsTxtHandler } from "./llms-txt";
    17|
    18|export interface SsrRenderResult {
    19|	html: string;
    20|	head: string;
    21|	status: number;
    22|	redirect?: string;
    23|}
    24|
    25|export function registerAdSenseTextRoutes(app: Express, config: AdSenseRuntimeConfig): void {
    26|	app.get("/ads.txt", (_req, res) => {
    27|		const content = resolveAdSenseTextFile(config, "adsTxt");
    28|		if (content === null) {
    29|			res
    30|				.status(404)
    31|				.type("text/plain")
    32|				.set("Cache-Control", "no-cache")
    33|				.send("Not found\n");
    34|			return;
    35|		}
    36|		res.type("text/plain").set("Cache-Control", "no-cache").send(content);
    37|	});
    38|
    39|	app.get("/app-ads.txt", (_req, res) => {
    40|		const content = resolveAdSenseTextFile(config, "appAdsTxt");
    41|		if (content === null) {
    42|			res
    43|				.status(404)
    44|				.type("text/plain")
    45|				.set("Cache-Control", "no-cache")
    46|				.send("Not found\n");
    47|			return;
    48|		}
    49|		res.type("text/plain").set("Cache-Control", "no-cache").send(content);
    50|	});
    51|}
    52|
    53|export function renderSsrDocument(
    54|	template: string,
    55|	result: Pick<SsrRenderResult, "head" | "html">,
    56|	adSenseConfig: Pick<AdSenseRuntimeConfig, "scriptHtml">,
    57|): string {
    58|	const head = [result.head, adSenseConfig.scriptHtml].filter(Boolean).join("\n");
    59|	return template
    60|		.replace("<!--app-head-->", () => head)
    61|		.replace("<!--app-html-->", () => result.html);
    62|}
    63|
    64|function normalizeCommerceApiBaseUrlEnv() {
    65|	if (process.env.GODADDY_API_BASE_URL) return;
    66|	const hostOnly = process.env.VITE_GODADDY_API_HOST;
    67|	if (!hostOnly) return;
    68|	const normalizedHost = hostOnly.replace(/^https?:\/\//, "").trim();
    69|	if (!normalizedHost) return;
    70|	process.env.GODADDY_API_BASE_URL = `https://${normalizedHost}`;
    71|}
    72|
    73|normalizeCommerceApiBaseUrlEnv();
    74|
    75|const app = express();
    76|
    77|// Honour x-forwarded-* from the load balancer so req.protocol/req.hostname
    78|// reflect the public-facing values. Express-maintained parsing respects the
    79|// existing trust-proxy config; direct header reads would let a client spoof
    80|// the sitemap origin in robots.txt.
    81|app.set("trust proxy", true);
    82|
    83|app.use(express.json());
    84|app.use(express.urlencoded({ extended: true }));
    85|
    86|// <api-registrations>
    87|app.get("/api/health", healthGet);
    88|// </api-registrations>
    89|
    90|// Error middleware must be registered AFTER the routes it protects; Express
    91|// only passes errors to middleware defined later in the stack.
    92|app.use("/api", (err: unknown, req: Request, res: Response, _next: NextFunction) => {
    93|	// Always respond JSON on /api so clients parsing response.json() don't
    94|	// receive Express's default HTML error page for non-Error throws.
    95|	console.error("ssr.api.error", {
    96|		url: req.url,
    97|		error: err instanceof Error ? err.stack : String(err),
    98|	});
    99|	res.status(500).json({ error: "Internal server error" });
   100|});
   101|
   102|function baseUrl(req: Request): string {
   103|	return `${req.protocol}://${req.hostname}`;
   104|}
   105|
   106|function escapeXml(s: string): string {
   107|	return s.replace(/[&<>"']/g, (c) =>
   108|		({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!,
   109|	);
   110|}
   111|
   112|app.get("/robots.txt", (req, res) => {
   113|	if (isSystemHost(req)) {
   114|		res
   115|			.type("text/plain")
   116|			.set("Cache-Control", "public, max-age=60, must-revalidate").set("Vary", "Host")
   117|			.send("User-agent: *\nDisallow: /\n");
   118|		return;
   119|	}
   120|	const base = baseUrl(req);
   121|	const body = [
   122|		"User-agent: *",
   123|		"Allow: /",
   124|		"",
   125|		`Sitemap: ${base}/sitemap.xml`,
   126|		"",
   127|	].join("\n");
   128|	res.type("text/plain").set("Cache-Control", "public, max-age=60, must-revalidate").set("Vary", "Host").send(body);
   129|});
   130|
   131|app.get("/sitemap.xml", (req, res) => {
   132|	if (isSystemHost(req)) {
   133|		const empty = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>\n`;
   134|		res.type("application/xml").set("Cache-Control", "public, max-age=60, must-revalidate").set("Vary", "Host").send(empty);
   135|		return;
   136|	}
   137|	const base = baseUrl(req);
   138|	const urls = seoRoutes
   139|		.filter((r) => typeof r.path === "string" && r.path.startsWith("/"))
   140|		.map((r) => {
   141|			const loc = `${base}${r.path}`;
   142|			const parts = [`    <loc>${escapeXml(loc)}</loc>`];
   143|			if (r.lastmod) parts.push(`    <lastmod>${escapeXml(r.lastmod)}</lastmod>`);
   144|			if (r.changefreq) parts.push(`    <changefreq>${r.changefreq}</changefreq>`);
   145|			if (r.priority !== undefined)
   146|				parts.push(`    <priority>${r.priority.toFixed(1)}</priority>`);
   147|			return `  <url>\n${parts.join("\n")}\n  </url>`;
   148|		})
   149|		.join("\n");
   150|	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
   151|	res.type("application/xml").set("Cache-Control", "public, max-age=60, must-revalidate").set("Vary", "Host").send(body);
   152|});
   153|
   154|app.get("/llms.txt", llmsTxtHandler);
   155|
   156|if (import.meta.env.PROD) {
   157|	const __dirname = dirname(fileURLToPath(import.meta.url));
   158|	const clientDir = join(__dirname, "client");
   159|	const adSenseRuntimeConfig = loadAdSenseRuntimeConfig(__dirname);
   160|
   161|	registerAdSenseTextRoutes(app, adSenseRuntimeConfig);
   162|
   163|	app.use(
   164|		express.static(clientDir, {
   165|			index: false,
   166|			setHeaders(res, filePath) {
   167|				res.set(
   168|					"Cache-Control",
   169|					filePath.includes("/assets/")
   170|						? "public, max-age=31536000, immutable"
   171|						: "no-cache",
   172|				);
   173|			},
   174|		}),
   175|	);
   176|
   177|	app.use((_req, res, next) => {
   178|		res.set("Cache-Control", "no-cache");
   179|		next();
   180|	});
   181|
   182|	let template: string;
   183|	try {
   184|		template = readFileSync(join(clientDir, "index.html"), "utf-8");
   185|	} catch (err) {
   186|		console.error("ssr.template.load-failed", {
   187|			path: join(clientDir, "index.html"),
   188|			error: err instanceof Error ? err.message : String(err),
   189|		});
   190|		process.exit(1);
   191|	}
   192|	if (!template.includes("<!--app-head-->") || !template.includes("<!--app-html-->")) {
   193|		// Fail fast at boot, same as a template load failure above: without
   194|		// markers, every .replace() call on the render path is a no-op and we
   195|		// would serve a shell with no <head> content and no rendered body on
   196|		// every request. Preferring process.exit over a degraded mode ensures
   197|		// an operator notices and fixes the build rather than serving broken
   198|		// SEO-invisible pages indefinitely.
   199|		console.error("ssr.template.markers-missing", {
   200|			hasHead: template.includes("<!--app-head-->"),
   201|			hasHtml: template.includes("<!--app-html-->"),
   202|		});
   203|		process.exit(1);
   204|	}
   205|	const fallbackShell = template
   206|		.replace("<!--app-head-->", "")
   207|		.replace("<!--app-html-->", "");
   208|
   209|	// Resolve the SSR module once into a stable render function. A failed
   210|	// load is unrecoverable at runtime - exiting lets the container
   211|	// scheduler restart with a clean slate rather than leaving the server
   212|	// to serve silent 503s indefinitely against a single startup log.
   213|	let renderFn: ((url: string) => Promise<SsrRenderResult>) | null = null;
   214|	const SSR_MODULE_LOAD_TIMEOUT_MS = 30_000;
   215|	const loadTimeout = setTimeout(() => {
   216|		if (renderFn !== null) return;
   217|		console.error("ssr.module.load-timeout", {
   218|			timeoutMs: SSR_MODULE_LOAD_TIMEOUT_MS,
   219|		});
   220|		process.exit(1);
   221|	}, SSR_MODULE_LOAD_TIMEOUT_MS);
   222|	loadTimeout.unref();
   223|	import("../entry-server").then(
   224|		(mod) => {
   225|			clearTimeout(loadTimeout);
   226|			renderFn = mod.render;
   227|		},
   228|		(err) => {
   229|			clearTimeout(loadTimeout);
   230|			console.error("ssr.module.load-failed", {
   231|				error: err instanceof Error ? err.stack : String(err),
   232|			});
   233|			process.exit(1);
   234|		},
   235|	);
   236|
   237|	app.get(/.*/, async (req, res, next) => {
   238|		if (req.method !== "GET") return next();
   239|		if (req.path.startsWith("/api")) return next();
   240|		if (extname(req.path)) return next();
   241|		const sendFallback = () =>
   242|			res
   243|				.status(503)
   244|				.set("Content-Type", "text/html; charset=utf-8")
   245|				.set("Cache-Control", "no-store")
   246|				.send(fallbackShell);
   247|		if (renderFn === null) {
   248|			// Module not yet resolved; fall back without logging to avoid startup
   249|			// noise before the first render is even possible. A terminal load
   250|			// failure (import reject or 30s timeout) process.exit(1)s from the
   251|			// loader above, so this branch is only the brief warmup window.
   252|			return sendFallback();
   253|		}
   254|		try {
   255|			const result = await renderFn(req.url);
   256|			if (result.redirect) {
   257|				// Redirect thrown from a loader/action surfaces as a Response.
   258|				// Forward it so the browser actually navigates to the new URL
   259|				// instead of seeing an empty shell with a stale status.
   260|				res.redirect(result.status, result.redirect);
   261|				return;
   262|			}
   263|			if (!result.html) {
   264|				// A non-redirect Response was thrown from a loader (e.g.
   265|				// `throw new Response(null, { status: 404 })`). renderToString
   266|				// produced no markup, so we have a real status but no body.
   267|				// Log so the case is observable in ops dashboards, and mark
   268|				// no-store so CDNs don't cache an empty page as a valid hit.
   269|				// User-visible 404 / error pages should come from a route
   270|				// errorElement, not from this fallback path.
   271|				console.error("ssr.render.error-response", {
   272|					url: req.url,
   273|					status: result.status,
   274|				});
   275|				res
   276|					.status(result.status)
   277|					.set("Content-Type", "text/html; charset=utf-8")
   278|					.set("Cache-Control", "no-store")
   279|					.send(fallbackShell);
   280|				return;
   281|			}
   282|			// Per-host SEO injection. System URLs get a noindex meta so
   283|			// crawlers drop them from the index over time; customer-attached
   284|			// hosts get a self-canonical link so search engines treat them
   285|			// as authoritative for the rendered content.
   286|			const seoHead = isSystemHost(req)
   287|				? `<meta name="robots" content="noindex,nofollow">`
   288|				: `<link rel="canonical" href="${escapeXml(`${req.protocol}://${req.hostname}${req.path}`)}">`;
   289|			// Function replacements disable String.replace's $-special sequences
   290|			// ($&, $', $`, $$) so user-authored titles / JSON-LD like
   291|			// "Save $& today" insert literally instead of being interpolated.
   292|			const out = renderSsrDocument(
   293|				template,
   294|				{ ...result, head: seoHead + result.head },
   295|				adSenseRuntimeConfig,
   296|			);
   297|			res
   298|				.status(result.status)
   299|				.set("Content-Type", "text/html; charset=utf-8")
   300|				.set("Cache-Control", "no-cache")
   301|				.send(out);
   302|		} catch (err) {
   303|			// 503 surfaces the failure in CDN/monitoring without caching a broken
   304|			// page as success. console.error (not warn) puts it at the right log
   305|			// level for the observability pipeline to alert on.
   306|			console.error("ssr.render.failed", {
   307|				url: req.url,
   308|				// Log the full stack — React's renderToString annotates it with
   309|				// the failing component's call tree, which the message alone
   310|				// discards.
   311|				error: err instanceof Error ? err.stack : String(err),
   312|			});
   313|			sendFallback();
   314|		}
   315|	});
   316|
   317|	const shutdown = async (signal: string) => {
   318|		console.log(`Got ${signal}, shutting down gracefully...`);
   319|		// Scope the ERR_MODULE_NOT_FOUND suppression to the import() only.
   320|		// A closeConnection() failure that happens to carry the same code
   321|		// (unlikely but possible for wrapped errors) must not be silently
   322|		// swallowed - it indicates a real db-close failure worth logging.
   323|		let mod: { closeConnection?: () => Promise<void> | void } | null = null;
   324|		try {
   325|			const dbClient = "./db/client" + ".js";
   326|			mod = await import(/* @vite-ignore */ dbClient);
   327|		} catch (error: unknown) {
   328|			const code = (error as { code?: string } | null)?.code;
   329|			if (code !== "ERR_MODULE_NOT_FOUND") {
   330|				console.error("ssr.shutdown.db-import-failed", {
   331|					error: error instanceof Error ? error.message : String(error),
   332|				});
   333|			}
   334|		}
   335|		if (mod && typeof mod.closeConnection === "function") {
   336|			try {
   337|				await mod.closeConnection();
   338|				console.log("Database connections closed");
   339|			} catch (error: unknown) {
   340|				console.error("ssr.shutdown.db-close-failed", {
   341|					error: error instanceof Error ? error.message : String(error),
   342|				});
   343|			}
   344|		}
   345|		process.exit(0);
   346|	};
   347|
   348|	(["SIGTERM", "SIGINT"] as const).forEach((signal) => {
   349|		process.once(signal, () => {
   350|			void shutdown(signal);
   351|		});
   352|	});
   353|
   354|	const rawPort = process.env.PORT || "3000";
   355|	const port = parseInt(rawPort, 10);
   356|	if (!Number.isInteger(port) || port <= 0 || port > 65535) {
   357|		// parseInt("abc") returns NaN; passing that to app.listen throws
   358|		// synchronously before the server.on("error") handler below can catch
   359|		// it. Fail fast with an actionable log rather than a cryptic crash.
   360|		console.error("ssr.server.invalid-port", { rawPort });
   361|		process.exit(1);
   362|	}
   363|	const host = process.env.HOST || "0.0.0.0";
   364|	const server = app.listen(port, host, () => {
   365|		console.log(`Server listening on http://${host}:${port}`);
   366|	});
   367|	server.on("error", (err: NodeJS.ErrnoException) => {
   368|		console.error("ssr.server.listen-failed", {
   369|			port,
   370|			host,
   371|			code: err.code,
   372|			error: err.message,
   373|		});
   374|		process.exit(1);
   375|	});
   376|}
   377|
   378|export default app;
   379|
