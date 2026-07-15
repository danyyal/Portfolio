import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Alert,
  Divider,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import {
  SiAdobe,
  SiApache,
  SiGraphql,
  SiReact,
  SiFastly,
} from "react-icons/si";
import { VscCode, VscJson } from "react-icons/vsc";
import { MdPlayArrow, MdRefresh } from "react-icons/md";
import Particle from "../Particle";

const CodeBlock = ({
  title,
  code,
  color = "#9cdcfe",
}: {
  title: string;
  code: string;
  color?: string;
}) => (
  <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.3)", mb: 2, textAlign: "left" }}>
    <Typography variant="subtitle2" sx={{ color: "#aaa", mb: 1 }}>
      {title}
    </Typography>
    <Box
      component="pre"
      sx={{
        bgcolor: "#1e1e1e",
        p: 2,
        borderRadius: 1,
        overflow: "auto",
        fontSize: "12px",
        textAlign: "left",
        color,
        m: 0,
      }}
    >
      {code}
    </Box>
  </Paper>
);

// Simulated Content Fragment data
const sampleContentFragments = {
  hero: {
    title: "Welcome to Our Platform",
    subtitle: "Building digital experiences",
    ctaText: "Get Started",
    ctaLink: "/signup",
  },
  product: {
    name: "Premium Plan",
    price: "$99/month",
    features: ["Unlimited access", "Priority support", "Custom integrations"],
    description: "Our most popular plan for growing businesses",
  },
  article: {
    headline: "Latest Tech News",
    author: "John Doe",
    publishDate: "2024-01-15",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    tags: ["technology", "innovation", "react"],
  },
};

// Content Fragment Demo Component
const ContentFragmentDemo = () => {
  const [selectedFragment, setSelectedFragment] =
    useState<keyof typeof sampleContentFragments>("hero");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<
    (typeof sampleContentFragments)[keyof typeof sampleContentFragments] | null
  >(null);

  const simulateFetch = () => {
    setIsLoading(true);
    setFetchedData(null);
    setTimeout(() => {
      setFetchedData(sampleContentFragments[selectedFragment]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: "var(--accent)" }}>
        Content Fragments Demo
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Content Fragments are structured content pieces stored in AEM that can
        be delivered headlessly via GraphQL APIs.
      </Alert>

      <Row>
        <Col md={6}>
          <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.3)", mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: "#aaa", mb: 1 }}>
              1. Select a Content Fragment Model:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {(
                Object.keys(sampleContentFragments) as Array<
                  keyof typeof sampleContentFragments
                >
              ).map((key) => (
                <Chip
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  onClick={() => setSelectedFragment(key)}
                  color={selectedFragment === key ? "secondary" : "default"}
                  sx={{ cursor: "pointer" }}
                />
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.3)", mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: "#aaa", mb: 1 }}>
              2. GraphQL Query (Auto-generated):
            </Typography>
            <Box
              component="pre"
              sx={{
                bgcolor: "#1e1e1e",
                p: 2,
                borderRadius: 1,
                overflow: "auto",
                fontSize: "12px",
                color: "#9cdcfe",
              }}
            >
              {`query Get${selectedFragment.charAt(0).toUpperCase() + selectedFragment.slice(1)}Fragment {
  ${selectedFragment}ByPath(
    _path: "/content/dam/${selectedFragment}"
  ) {
    item {
      ${Object.keys(sampleContentFragments[selectedFragment]).join("\n      ")}
    }
  }
}`}
            </Box>
          </Paper>

          <Button
            variant="contained"
            startIcon={
              isLoading ? <MdRefresh className="spin" /> : <MdPlayArrow />
            }
            onClick={simulateFetch}
            disabled={isLoading}
            sx={{ bgcolor: "var(--accent)", "&:hover": { bgcolor: "var(--btn-primary-hover)" } }}
          >
            {isLoading ? "Fetching..." : "Fetch Content Fragment"}
          </Button>
        </Col>

        <Col md={6}>
          <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.3)", minHeight: 300 }}>
            <Typography variant="subtitle2" sx={{ color: "#aaa", mb: 1 }}>
              3. Response (JSON):
            </Typography>
            {fetchedData ? (
              <Box
                component="pre"
                sx={{
                  bgcolor: "#1e1e1e",
                  p: 2,
                  borderRadius: 1,
                  overflow: "auto",
                  fontSize: "12px",
                  color: "#ce9178",
                }}
              >
                {JSON.stringify(fetchedData, null, 2)}
              </Box>
            ) : (
              <Box sx={{ color: "#666", textAlign: "center", py: 4 }}>
                Click "Fetch Content Fragment" to see the response
              </Box>
            )}

            {fetchedData && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ color: "#aaa", mb: 1 }}>
                  4. Rendered React Component:
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "rgba(199, 112, 240, 0.1)",
                    border: "1px solid var(--accent)",
                  }}
                >
                  {selectedFragment === "hero" && (
                    <Box textAlign="center">
                      <Typography variant="h5" sx={{ color: "white" }}>
                        {
                          (fetchedData as typeof sampleContentFragments.hero)
                            .title
                        }
                      </Typography>
                      <Typography sx={{ color: "#aaa" }}>
                        {
                          (fetchedData as typeof sampleContentFragments.hero)
                            .subtitle
                        }
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1, color: "var(--accent)", borderColor: "var(--accent)" }}
                      >
                        {
                          (fetchedData as typeof sampleContentFragments.hero)
                            .ctaText
                        }
                      </Button>
                    </Box>
                  )}
                  {selectedFragment === "product" && (
                    <Box>
                      <Typography variant="h6" sx={{ color: "white" }}>
                        {
                          (fetchedData as typeof sampleContentFragments.product)
                            .name
                        }
                      </Typography>
                      <Typography variant="h4" sx={{ color: "var(--accent)" }}>
                        {
                          (fetchedData as typeof sampleContentFragments.product)
                            .price
                        }
                      </Typography>
                      <ul style={{ color: "#aaa" }}>
                        {(
                          fetchedData as typeof sampleContentFragments.product
                        ).features.map((f: string, i: number) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </Box>
                  )}
                  {selectedFragment === "article" && (
                    <Box>
                      <Typography variant="h6" sx={{ color: "white" }}>
                        {
                          (fetchedData as typeof sampleContentFragments.article)
                            .headline
                        }
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>
                        By{" "}
                        {
                          (fetchedData as typeof sampleContentFragments.article)
                            .author
                        }{" "}
                        |{" "}
                        {
                          (fetchedData as typeof sampleContentFragments.article)
                            .publishDate
                        }
                      </Typography>
                      <Typography sx={{ color: "#aaa", mt: 1 }}>
                        {
                          (fetchedData as typeof sampleContentFragments.article)
                            .content
                        }
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {(
                          fetchedData as typeof sampleContentFragments.article
                        ).tags.map((tag: string) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              mr: 0.5,
                              bgcolor: "rgba(199, 112, 240, 0.3)",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </>
            )}
          </Paper>
        </Col>
      </Row>
    </Box>
  );
};

// Experience Fragment Demo
const ExperienceFragmentDemo = () => {
  const [activeVariation, setActiveVariation] = useState("desktop");

  const variations = {
    desktop: {
      layout: "horizontal",
      showImage: true,
      imageSize: "large",
    },
    mobile: {
      layout: "vertical",
      showImage: true,
      imageSize: "small",
    },
    email: {
      layout: "vertical",
      showImage: false,
      imageSize: "none",
    },
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: "var(--accent)" }}>
        Experience Fragments Demo
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Experience Fragments are reusable content experiences that can have
        multiple variations for different channels (web, mobile, email, etc.).
      </Alert>

      <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.3)", mb: 2 }}>
        <Typography variant="subtitle2" sx={{ color: "#aaa", mb: 1 }}>
          Select Channel Variation:
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {Object.keys(variations).map((v) => (
            <Button
              key={v}
              variant={activeVariation === v ? "contained" : "outlined"}
              onClick={() => setActiveVariation(v)}
              sx={{
                bgcolor: activeVariation === v ? "var(--accent)" : "transparent",
                borderColor: "var(--accent)",
                color: activeVariation === v ? "white" : "var(--accent)",
                "&:hover": {
                  bgcolor:
                    activeVariation === v ? "var(--btn-primary-hover)" : "rgba(199,112,240,0.1)",
                },
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </Box>
      </Paper>

      <Row>
        <Col md={6}>
          <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.3)" }}>
            <Typography variant="subtitle2" sx={{ color: "#aaa", mb: 1 }}>
              Variation Config:
            </Typography>
            <Box
              component="pre"
              sx={{
                bgcolor: "#1e1e1e",
                p: 2,
                borderRadius: 1,
                fontSize: "12px",
                color: "#9cdcfe",
              }}
            >
              {JSON.stringify(
                variations[activeVariation as keyof typeof variations],
                null,
                2,
              )}
            </Box>
          </Paper>
        </Col>
        <Col md={6}>
          <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.3)" }}>
            <Typography variant="subtitle2" sx={{ color: "#aaa", mb: 1 }}>
              Rendered Output:
            </Typography>
            <Box
              sx={{
                border: "2px dashed var(--accent)",
                borderRadius: 2,
                p: 2,
                display: "flex",
                flexDirection:
                  variations[activeVariation as keyof typeof variations]
                    .layout === "vertical"
                    ? "column"
                    : "row",
                gap: 2,
                alignItems: "center",
              }}
            >
              {variations[activeVariation as keyof typeof variations]
                .showImage && (
                <Box
                  sx={{
                    width:
                      variations[activeVariation as keyof typeof variations]
                        .imageSize === "large"
                        ? 120
                        : 60,
                    height:
                      variations[activeVariation as keyof typeof variations]
                        .imageSize === "large"
                        ? 80
                        : 40,
                    bgcolor: "rgba(199, 112, 240, 0.3)",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    fontSize: "12px",
                  }}
                >
                  Image
                </Box>
              )}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Promo Banner
                </Typography>
                <Typography variant="caption" sx={{ color: "#aaa" }}>
                  {activeVariation === "email"
                    ? "Plain text for email"
                    : "Rich content for " + activeVariation}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Col>
      </Row>
    </Box>
  );
};

// Core Components Demo
const CoreComponentsDemo = () => {
  const [editableContent, setEditableContent] = useState({
    title: "Editable Title",
    text: "This text can be edited by content authors in AEM.",
    buttonLabel: "Click Me",
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: "var(--accent)" }}>
        AEM Core Components + React
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        AEM Core Components are standardized, reusable building blocks. In a
        React SPA, these map to React components that receive props from AEM's
        JSON API.
      </Alert>

      <Row>
        <Col md={5}>
          <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.3)" }}>
            <Typography variant="subtitle2" sx={{ color: "#aaa", mb: 2 }}>
              AEM Author Mode (Simulated):
            </Typography>
            <TextField
              fullWidth
              label="Title"
              value={editableContent.title}
              onChange={(e) =>
                setEditableContent({
                  ...editableContent,
                  title: e.target.value,
                })
              }
              sx={{ mb: 2 }}
              InputProps={{ sx: { color: "white" } }}
              InputLabelProps={{ sx: { color: "#aaa" } }}
            />
            <TextField
              fullWidth
              label="Text Content"
              multiline
              rows={3}
              value={editableContent.text}
              onChange={(e) =>
                setEditableContent({ ...editableContent, text: e.target.value })
              }
              sx={{ mb: 2 }}
              InputProps={{ sx: { color: "white" } }}
              InputLabelProps={{ sx: { color: "#aaa" } }}
            />
            <TextField
              fullWidth
              label="Button Label"
              value={editableContent.buttonLabel}
              onChange={(e) =>
                setEditableContent({
                  ...editableContent,
                  buttonLabel: e.target.value,
                })
              }
              InputProps={{ sx: { color: "white" } }}
              InputLabelProps={{ sx: { color: "#aaa" } }}
            />
          </Paper>
        </Col>
        <Col
          md={2}
          className="d-flex align-items-center justify-content-center"
        >
          <Box sx={{ textAlign: "center", color: "var(--accent)" }}>
            <Typography variant="caption">JSON API</Typography>
            <Box sx={{ fontSize: 30 }}>→</Box>
          </Box>
        </Col>
        <Col md={5}>
          <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.3)" }}>
            <Typography variant="subtitle2" sx={{ color: "#aaa", mb: 2 }}>
              React Component (Live Preview):
            </Typography>
            <Card
              style={{
                backgroundColor: "rgba(199, 112, 240, 0.1)",
                border: "1px solid var(--accent)",
                padding: "20px",
              }}
            >
              <Typography variant="h5" sx={{ color: "white", mb: 1 }}>
                {editableContent.title}
              </Typography>
              <Typography sx={{ color: "#ccc", mb: 2 }}>
                {editableContent.text}
              </Typography>
              <Button variant="contained" sx={{ bgcolor: "var(--accent)" }}>
                {editableContent.buttonLabel}
              </Button>
            </Card>
          </Paper>
        </Col>
      </Row>
    </Box>
  );
};

// HTL + Sling Models Demo
const htlSnippet = `<!-- teaser.html — HTL (Sightly) template -->
<sly data-sly-use.model="com.lebara.core.models.Teaser" />

<div class="cmp-teaser" data-cmp-is="teaser">
  <h2 class="cmp-teaser__title">\${model.title}</h2>
  <p class="cmp-teaser__description">\${model.description @ context='html'}</p>

  <sly data-sly-test="\${model.actions}">
    <a data-sly-repeat.action="\${model.actions}"
       class="cmp-teaser__action-link"
       href="\${action.url}">\${action.text}</a>
  </sly>

  <sly data-sly-resource="\${'image' @ resourceType='core/wcm/components/image/v3/image'}" />
</div>`;

const slingModelSnippet = `// Teaser.java — Sling Model with JSON exporter
@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { Teaser.class, ComponentExporter.class },
    resourceType = Teaser.RESOURCE_TYPE,
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
          extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class Teaser implements ComponentExporter {

    static final String RESOURCE_TYPE = "lebara/components/teaser";

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String description;

    @ChildResource
    private List<Action> actions;

    @ScriptVariable
    private Page currentPage;

    @PostConstruct
    protected void init() {
        // resolve inherited content, localization, targeting…
    }

    @Override
    public String getExportedType() { return RESOURCE_TYPE; }
}`;

const modelJsonSnippet = `// GET /content/site/page/jcr:content/teaser.model.json
{
  ":type": "lebara/components/teaser",
  "title": "Roam free in 36 countries",
  "description": "<p>Stay connected across Europe…</p>",
  "actions": [
    { "text": "See plans", "url": "/plans.html" }
  ],
  "image": {
    ":type": "core/wcm/components/image/v3/image",
    "src": "/content/dam/teaser.jpg"
  }
}`;

const HTLSlingDemo = () => (
  <Box>
    <Typography variant="h6" gutterBottom sx={{ color: "var(--accent)" }}>
      HTL Templates &amp; Sling Models
    </Typography>
    <Alert severity="info" sx={{ mb: 2 }}>
      The same Sling Model backs two render paths: HTL renders server-side HTML
      for classic pages, while the Sling Model Exporter serializes it to JSON
      (<code>.model.json</code>) for SPAs — one Java class, two channels.
    </Alert>

    <Row>
      <Col lg={6}>
        <CodeBlock title="1. HTL template (server-side render path)" code={htlSnippet} color="#ce9178" />
        <CodeBlock title="3. JSON export (headless render path)" code={modelJsonSnippet} color="#9cdcfe" />
      </Col>
      <Col lg={6}>
        <CodeBlock title="2. Sling Model (single source of truth)" code={slingModelSnippet} color="#b5cea8" />
      </Col>
    </Row>

    <Alert severity="success" icon={<VscJson />}>
      In the React SPA, AEM's <code>ModelManager</code> fetches the page's
      <code> .model.json</code> and the <code>MapTo("lebara/components/teaser")</code>{" "}
      registration renders the matching React component — enabling in-context
      editing via the SPA Editor.
    </Alert>
  </Box>
);

// Architecture Flow
const ArchitectureFlow = () => {
  const steps = [
    {
      label: "AEM Author (AEMaaCS)",
      description:
        "Authors work in the Touch UI against the author tier. Content lives in the JCR (Apache Jackrabbit Oak) under /content; the Content Fragment editor enforces structured models defined in /conf. Publishing replicates content to the publish tier via Sling Content Distribution.",
      tech: ["JCR / Oak", "Content Fragment Models", "Sling Content Distribution"],
      icon: <SiAdobe />,
    },
    {
      label: "Apache Sling + OSGi",
      description:
        "Every request is resource-resolved: Sling maps the URL to a JCR resource, then picks a script/servlet by resource type, selector, and extension (e.g. teaser.model.json → Sling Model Exporter). Business logic ships as versioned OSGi bundles deployed via the Felix container.",
      tech: ["Resource Resolution", "Selectors", "OSGi / Felix"],
      icon: <SiApache />,
    },
    {
      label: "HTL + Sling Models",
      description:
        "HTL (Sightly) templates render XSS-safe server-side HTML with automatic display context escaping. Sling Models adapt resources to typed Java objects; the Jackson-based Model Exporter serializes the same models to JSON for headless consumers.",
      tech: ["HTL / Sightly", "Sling Models", "Model Exporter"],
      icon: <VscCode />,
    },
    {
      label: "GraphQL API",
      description:
        "Content Fragments are exposed through AEM's GraphQL endpoint with schemas generated from the fragment models. Production traffic uses persisted queries (GET + cacheable at the CDN) instead of ad-hoc POST queries.",
      tech: ["Persisted Queries", "Schema Generation", "Hypermedia"],
      icon: <SiGraphql />,
    },
    {
      label: "Dispatcher + CDN",
      description:
        "The dispatcher module in front of publish caches rendered HTML and JSON, applies filter rules, and invalidates on replication events (stat files). A CDN (Fastly/Akamai) fronts the dispatcher; cache keys respect selectors and query persistence.",
      tech: ["Cache Invalidation", "Filter Rules", "Edge Caching"],
      icon: <SiFastly />,
    },
    {
      label: "React SPA",
      description:
        "The SPA consumes .model.json or GraphQL responses. With the AEM SPA Editor SDK, MapTo() binds AEM resource types to React components so authors keep in-context drag-and-drop editing on top of a fully client-rendered app.",
      tech: ["SPA Editor SDK", "MapTo()", "ModelManager"],
      icon: <SiReact />,
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: "var(--accent)" }}>
        AEM + React Architecture
      </Typography>
      <Stepper orientation="vertical" sx={{ mt: 2 }}>
        {steps.map((step) => (
          <Step key={step.label} active={true}>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "rgba(56, 189, 248, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    fontSize: 20,
                  }}
                >
                  {step.icon}
                </Box>
              )}
            >
              <Typography sx={{ color: "white", fontWeight: "bold" }}>
                {step.label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography sx={{ color: "#aaa" }}>{step.description}</Typography>
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 1 }}>
                {step.tech.map((tech) => (
                  <Chip
                    key={tech}
                    label={tech}
                    size="small"
                    sx={{
                      bgcolor: "rgba(56, 189, 248, 0.12)",
                      color: "var(--accent)",
                      fontSize: "11px",
                    }}
                  />
                ))}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

// Main Playground Component
const tabs = [
  { id: "architecture", label: "Architecture", component: ArchitectureFlow },
  { id: "htl-sling", label: "HTL & Sling Models", component: HTLSlingDemo },
  {
    id: "content-fragments",
    label: "Content Fragments",
    component: ContentFragmentDemo,
  },
  {
    id: "experience-fragments",
    label: "Experience Fragments",
    component: ExperienceFragmentDemo,
  },
  {
    id: "core-components",
    label: "Core Components",
    component: CoreComponentsDemo,
  },
];

/* The demos hardcode dark surfaces, so MUI runs in dark mode here
   regardless of the site theme. */
const aemTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#38bdf8" },
    secondary: { main: "#a78bfa" },
    background: { default: "#081226", paper: "#0d1b33" },
  },
  typography: { fontFamily: "Inter, system-ui, sans-serif" },
  shape: { borderRadius: 8 },
});

export default function AEMPlayground() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = searchParams.get("tab") ?? tabs[0].id;
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  const ActiveDemo = active.component;

  return (
    <Container fluid className="project-section" style={{ minHeight: "100vh" }}>
      <Particle />
      <Container>
        <h1 className="project-heading" style={{ paddingTop: "20px" }}>
          <strong className="purple">AEM</strong> + React Playground
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          How Adobe Experience Manager delivers content to React — from JCR and
          Sling resource resolution to GraphQL, the dispatcher, and the SPA
          Editor. Based on production work for Lebara's multi-country platform.
        </p>

        <div className="year-btn-group" role="tablist" aria-label="AEM demos">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active.id === tab.id}
              className={`year-btn ${active.id === tab.id ? "active" : ""}`}
              onClick={() => setSearchParams({ tab: tab.id })}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ThemeProvider theme={aemTheme}>
          <Paper sx={{ p: 3, bgcolor: "rgba(0,0,0,0.5)", borderRadius: 2 }}>
            <ActiveDemo />
          </Paper>
        </ThemeProvider>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "var(--text-muted)" }}>
            This playground simulates AEM-React integration patterns. In
            production, data comes from actual AEM author/publish instances
            behind a dispatcher.
          </Typography>
        </Box>
      </Container>
    </Container>
  );
}
