import type { ModelDetail } from "./modelDetails";

/* Engineering evidence: how specific things are built, with the numbers the
   code and its documentation record. Descriptions only, never source. */

export type Evidence = {
  title: string;
  kicker: string;
  summary: string;
  readout: string;
  detail: ModelDetail;
};

export const evidence: Evidence[] = [
  {
    title: "Streaming AI answers",
    kicker: "Realtime · streaming",
    summary:
      "Chat answers arrive token by token over Server-Sent Events, built to survive the load balancer and CDN that sit in front of the API.",
    readout: "Keepalive every 15 s",
    detail: {
      role: "Answers from the AI chat stream to the browser as they are written. The stream runs over a POST request read with a stream reader, because the request has to carry a login token and a body, which the browser's built-in event stream cannot do.",
      stats: [
        { label: "Keepalive interval", value: "15 s" },
        { label: "Load-balancer idle timeout it beats", value: "60 s" },
        { label: "CDN origin timeout it beats", value: "120 s" },
        { label: "Grace period for slow JSON endpoints", value: "10 s" },
      ],
      config: [
        {
          title: "Design",
          rows: [
            {
              label: "Transport",
              value: "Server-Sent Events over a POST fetch stream",
            },
            { label: "Client", value: "stream reader, buffers partial lines" },
            { label: "Cancel", value: "AbortController from the Stop button" },
            { label: "Proxy buffering", value: "switched off per response" },
            {
              label: "Access",
              value: "login guard · module entitlement · per-user throttle",
            },
          ],
        },
      ],
      notes: [
        "A model that thinks before its first word sends nothing for a while, and the load balancer used to cut the connection. A comment line every 15 seconds keeps it open; this fixed a real production fault.",
        "Slow plain-JSON endpoints get the same treatment: they behave normally with real status codes for the first 10 seconds, then send whitespace heartbeats, and report a typed error if the work fails after the response has started.",
        "The organisation always comes from the signed-in user, never from the request body.",
      ],
    },
  },
  {
    title: "WebSocket link to on-premise servers",
    kicker: "Realtime · WebSockets",
    summary:
      "The cloud pushes processing jobs to servers inside customer networks over MQTT 5 on signed WebSockets, with credentials scoped to one server each.",
    readout: "MQTT 5 · at-least-once",
    detail: {
      role: "Some customers run the processing on their own hardware. Those servers cannot accept inbound connections, so each one holds an outbound WebSocket to a message broker and receives jobs and admin commands over it.",
      stats: [
        { label: "Protocol", value: "MQTT 5 over WebSocket" },
        { label: "Delivery", value: "at-least-once" },
        { label: "Topics", value: "one per server" },
        { label: "Tunnel restart backoff", value: "1 s → 60 s" },
        { label: "Backoff reset after", value: "30 s stable" },
        { label: "Tests in the on-premise app", value: "~170 in 16 files" },
      ],
      config: [
        {
          title: "Design",
          rows: [
            {
              label: "Authentication",
              value: "request signing with short-lived credentials",
            },
            {
              label: "Authorisation",
              value: "one role per server, limited to its own topic",
            },
            {
              label: "Credential rotation",
              value: "client rebuilt when credentials roll over",
            },
            {
              label: "Admin commands",
              value: "fixed allowlist on both ends, never a shell string",
            },
            {
              label: "Storage access",
              value: "outbound tunnel, TLS end to end, no port forwarding",
            },
          ],
        },
      ],
      notes: [
        "Connection state is tracked from the broker's lifecycle events, so the platform knows which servers are reachable before it sends work.",
        "The tunnel process is supervised: exponential backoff on restart, and a watchdog for the case where it never came up at all.",
        "Inside the web app itself, live updates use short polling against a cheap count-and-timestamp endpoint, paused in background tabs, instead of a socket.",
      ],
    },
  },
  {
    title: "AI assistant with tools",
    kicker: "Chat · agents",
    summary:
      "An assistant that answers questions across a whole organisation by calling tools, and keeps working after the browser tab is closed.",
    readout: "23 tools · 17 read, 6 propose",
    detail: {
      role: "A chat assistant for the whole organisation: it searches drawings, reads extracted characteristics, compares revisions and looks up inspections by calling tools. Anything that would change data is only proposed; the user confirms it on a card.",
      stats: [
        { label: "Tools", value: "23" },
        { label: "Read · propose", value: "17 · 6" },
        { label: "Model calls per question, at most", value: "15" },
        { label: "Heartbeat while a turn runs", value: "5 s" },
        { label: "Turn treated as dead after", value: "2 min silent" },
        { label: "Hard limit per turn", value: "30 min" },
        { label: "Messages per user", value: "20 per minute" },
        { label: "Tests on the API side", value: "~185" },
      ],
      config: [
        {
          title: "Design",
          rows: [
            {
              label: "Model",
              value: "Claude through Amazon Bedrock, EU region, streaming",
            },
            {
              label: "Tenant scoping",
              value: "organisation injected server-side, never a tool argument",
            },
            {
              label: "Writes",
              value: "propose → confirm card → separate endpoint",
            },
            {
              label: "History replayed",
              value: "20 turns or 60,000 characters",
            },
            { label: "Usage", value: "token counts stored per turn" },
          ],
        },
      ],
      notes: [
        "A turn runs independently of the HTTP request. Closing the tab only detaches the reader; the answer is still stored and the user is notified. Stop ends it and keeps the partial answer, with a way to continue.",
        "A sweep every minute fails abandoned turns exactly once, even with several API instances running.",
        "Tools are switched off on the last allowed call, so the model has to answer. If a round ends with nothing to show, one more runs at lower effort.",
        "Rate limits are keyed on the user, not the IP address, so colleagues behind one office address are not throttled together.",
      ],
    },
  },
  {
    title: "Chat about one drawing",
    kicker: "Chat · context",
    summary:
      "A chat that can see the drawing itself: prompt caching, context compaction and image tiling keep it fast and legible within the provider's limits.",
    readout: "2 cache breakpoints",
    detail: {
      role: "A second chat lives beside each drawing and can read the drawing image, the extracted data and earlier revisions. The work is in fitting very large sheets into a single request without the small dimension text becoming unreadable.",
      stats: [
        { label: "Prompt-cache breakpoints", value: "2" },
        { label: "Compaction starts at", value: "~150k tokens" },
        { label: "Recent context kept", value: "~30k tokens" },
        { label: "File budget per request", value: "17 of 20 MB" },
        { label: "Images per request", value: "20, 4 kept for tools" },
        { label: "Tool rounds, at most", value: "5" },
      ],
      config: [
        {
          title: "Image tiling",
          rows: [
            {
              label: "Layout",
              value: "full page plus four overlapping quarters",
            },
            { label: "Quarter size", value: "55 % of the page each way" },
            { label: "Shared strip between neighbours", value: "10 %" },
            {
              label: "Native PDF path",
              value: "up to 6 MB, otherwise page images",
            },
          ],
        },
      ],
      notes: [
        "The drawing and its extracted data sit behind the first cache breakpoint, so every follow-up question reads them from cache instead of paying for them again.",
        "The model reads a limited number of pixels on the long edge. Sending overlapping quarters as well as the full page roughly doubles the size at which small dimension text arrives.",
        "Each page is decoded once, at exactly the size where a quarter needs no further scaling.",
      ],
    },
  },
  {
    title: "Webpack and build pipeline",
    kicker: "Build · webpack",
    summary:
      "Webpack bundles the API and the Lambda functions; Vite builds the front end with custom plugins for WebAssembly and workers.",
    readout: "6 webpack configs · 7 Vite plugins",
    detail: {
      role: "The product ships as an API service, a set of Lambda functions and a browser app, each with its own build. The Lambda bundles in particular are shaped by the runtime they land in.",
      stats: [
        { label: "Webpack configurations", value: "6" },
        { label: "Lambdas in one artifact", value: "2, compiled separately" },
        { label: "Custom Vite plugins", value: "7" },
        { label: "Lazily loaded components", value: "9" },
        { label: "Dynamic imports", value: "24" },
        { label: "CI workflows", value: "15" },
      ],
      config: [
        {
          title: "Lambda bundles",
          rows: [
            { label: "Output", value: "one file per bundle, no split chunks" },
            { label: "ORM", value: "aliased to a single copy" },
            {
              label: "Native modules",
              value: "external, installed for the target platform",
            },
            { label: "Minifier", value: "keeps class names" },
            { label: "Redeploy trigger", value: "hash of the source files" },
          ],
        },
        {
          title: "Front end",
          rows: [
            {
              label: "Bundler",
              value: "Vite, content-hashed files, ES-module workers",
            },
            {
              label: "WebAssembly",
              value:
                "PDF renderer and ONNX Runtime served and emitted by plugins",
            },
            {
              label: "Monorepo",
              value: "Nx, tests run only for affected projects",
            },
          ],
        },
      ],
      notes: [
        "Every unusual setting records the failure that caused it. Split chunks failed to load on Lambda at runtime, so each bundle is forced into one file.",
        "Two copies of the ORM meant two metadata registries and entities that could not be found; aliasing to one copy fixed it. The minifier keeps class names for the same reason.",
        "A Lambda is rebuilt and redeployed only when one of its hashed source files changes.",
      ],
    },
  },
  {
    title: "Front-end performance",
    kicker: "Performance · web vitals",
    summary:
      "A viewer for 180-megapixel drawing pages that switches pages without stalling, plus this site's own numbers measured live in your browser.",
    readout: "~1.9 s stall removed",
    detail: {
      role: "Drawing pages are routinely about 16,000 × 11,300 pixels. Fetching, decoding and preparing one for the GPU took seconds, and it happened again on every page switch. A bounded cache of decoded pages removed the stall.",
      stats: [
        { label: "Typical page", value: "~180 megapixels" },
        { label: "Stall on each page switch, before", value: "~1.9 s" },
        { label: "Cache budget", value: "560 megapixels" },
        { label: "Cached pages, at most", value: "8" },
        { label: "Largest edge sent to the GPU", value: "16,384 px" },
        { label: "Virtualised tables", value: "8" },
      ],
      config: [
        {
          title: "How the page cache works",
          rows: [
            {
              label: "Eviction",
              value: "least recently used, by pixel budget and count",
            },
            {
              label: "Concurrent requests",
              value: "shared, one decode per page",
            },
            { label: "Neighbours", value: "prefetched" },
            {
              label: "Heavy work",
              value: "5 Web Workers, incl. CAD parsing in WebAssembly",
            },
          ],
        },
        {
          title: "This site, in the same session it gained a second mode",
          rows: [
            { label: "First-load script", value: "1,179 kB → 547 kB" },
            { label: "Same, compressed", value: "357 kB → 185 kB" },
            { label: "Screenshots and logo", value: "13.2 MB → 0.4 MB" },
            {
              label: "How",
              value:
                "routes loaded on demand · WebP · an unused UI provider removed",
            },
          ],
        },
      ],
      live: "vitals",
      notes: [
        "The cache is bounded by pixels, not by entries alone: eight small pages and eight huge ones cost very different amounts of memory.",
        "The CAD worker is long-lived, so every handle it takes from the WebAssembly kernel is released explicitly.",
        "The live figures below come from the Web Vitals library running in this page. They describe your visit, on your device and connection.",
      ],
    },
  },
  {
    title: "Rate limiting and orchestration",
    kicker: "Backend · reliability",
    summary:
      "Layered rate limits from the edge to single routes, and long-running work moved onto state machines and scheduled sweeps.",
    readout: "300/min default · 20 overrides",
    detail: {
      role: "Protection against abuse sits at three levels: the web firewall, a global limit in the API, and tighter limits on sensitive routes. Work that takes minutes runs as a state machine with retries, and scheduled jobs clean up whatever gets stuck.",
      stats: [
        { label: "Global default", value: "300 requests / min" },
        { label: "Per-route overrides", value: "20" },
        { label: "Login", value: "10 / min" },
        { label: "AI chat", value: "20 / min per user" },
        { label: "Scheduled jobs", value: "13" },
        { label: "Pipeline task states", value: "34" },
        { label: "Retry · catch blocks", value: "32 · 47" },
      ],
      config: [
        {
          title: "Design",
          rows: [
            {
              label: "Client address",
              value:
                "taken from the CDN hop only when the origin secret is present",
            },
            {
              label: "Edge",
              value: "firewall rate rules, stricter for sign-in",
            },
            {
              label: "Concurrency",
              value: "per-endpoint cap with a retry-after header",
            },
            {
              label: "Orchestration",
              value: "AWS Step Functions; Temporal for on-premise",
            },
            {
              label: "Watchdogs",
              value: "stuck drawings and stale runs swept every 10 min",
            },
          ],
        },
      ],
      notes: [
        "A forged forwarding header cannot be used to rotate rate-limit buckets, because the address is only trusted when the request provably came through the CDN.",
        "Limiter state is in-process: the service runs as one instance, so a shared store has not been needed yet.",
        "Guarded database updates make once-only work safe across instances, such as failing an abandoned assistant turn.",
      ],
    },
  },
  {
    title: "Testing and CI",
    kicker: "Quality",
    summary:
      "Around sixteen thousand automated tests across the product and the ML pipeline, with gates that stop a pull request from lowering coverage.",
    readout: "~10,700 + ~5,200 tests",
    detail: {
      role: "Every pull request runs lint, format, build, a migration-drift check and the tests of whatever it touched. The release to production is gated by end-to-end tests against staging.",
      stats: [
        { label: "Product tests", value: "~10,700" },
        { label: "Product test files", value: "771" },
        { label: "ML pipeline tests", value: "~5,200" },
        { label: "Pipeline test files, at the start", value: "3" },
        { label: "End-to-end specs", value: "39" },
        { label: "CI workflows", value: "15 + 12" },
      ],
      config: [
        {
          title: "Gates",
          rows: [
            {
              label: "Coverage",
              value: "fails on a drop of more than 5 % against main",
            },
            { label: "Secrets", value: "scanned on every push" },
            {
              label: "Translations",
              value: "7 languages, build fails on a missing key",
            },
            {
              label: "Pipeline",
              value: "golden outputs and scheduled mutation testing",
            },
          ],
        },
      ],
      notes: [
        "The ML pipeline started with three test files and no test job in CI; its testing plan documents the path from there.",
        "Tests run only for the projects a change affects, so a small pull request stays fast.",
        "A structural test walks the pipeline's state machine definition, so a broken transition fails before it is deployed.",
      ],
    },
  },
];
