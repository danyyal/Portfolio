import { useState } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
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
} from "@mui/material";
import { SiAdobe, SiApache, SiGraphql, SiReact } from "react-icons/si";
import { VscCode } from "react-icons/vsc";
import { MdPlayArrow, MdRefresh } from "react-icons/md";
import Particle from "../Particle";

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
      <Typography variant="h6" gutterBottom sx={{ color: "#c770f0" }}>
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
            sx={{ bgcolor: "#c770f0", "&:hover": { bgcolor: "#a855c7" } }}
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
                    border: "1px solid #c770f0",
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
                        sx={{ mt: 1, color: "#c770f0", borderColor: "#c770f0" }}
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
                      <Typography variant="h4" sx={{ color: "#c770f0" }}>
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
      <Typography variant="h6" gutterBottom sx={{ color: "#c770f0" }}>
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
                bgcolor: activeVariation === v ? "#c770f0" : "transparent",
                borderColor: "#c770f0",
                color: activeVariation === v ? "white" : "#c770f0",
                "&:hover": {
                  bgcolor:
                    activeVariation === v ? "#a855c7" : "rgba(199,112,240,0.1)",
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
                border: "2px dashed #c770f0",
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
                    color: "#c770f0",
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
      <Typography variant="h6" gutterBottom sx={{ color: "#c770f0" }}>
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
          <Box sx={{ textAlign: "center", color: "#c770f0" }}>
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
                border: "1px solid #c770f0",
                padding: "20px",
              }}
            >
              <Typography variant="h5" sx={{ color: "white", mb: 1 }}>
                {editableContent.title}
              </Typography>
              <Typography sx={{ color: "#ccc", mb: 2 }}>
                {editableContent.text}
              </Typography>
              <Button variant="contained" sx={{ bgcolor: "#c770f0" }}>
                {editableContent.buttonLabel}
              </Button>
            </Card>
          </Paper>
        </Col>
      </Row>
    </Box>
  );
};

// Architecture Flow
const ArchitectureFlow = () => {
  const steps = [
    {
      label: "AEM Author",
      description:
        "Content authors create and manage content using AEM's intuitive authoring interface. They work with Content Fragments, Experience Fragments, and page components.",
      icon: <SiAdobe />,
    },
    {
      label: "Apache Sling",
      description:
        "Sling is AEM's web framework that handles request processing. It maps URLs to content resources and enables RESTful content delivery.",
      icon: <SiApache />,
    },
    {
      label: "HTL Templates",
      description:
        "HTML Template Language (HTL/Sightly) renders server-side HTML. For headless delivery, Sling Model Exporters convert content to JSON.",
      icon: <VscCode />,
    },
    {
      label: "GraphQL API",
      description:
        "AEM's GraphQL endpoint exposes Content Fragments as queryable data. React apps fetch exactly the data they need with typed queries.",
      icon: <SiGraphql />,
    },
    {
      label: "React SPA",
      description:
        "The React application consumes AEM content via APIs, renders components, and can optionally integrate with AEM's SPA Editor for in-context editing.",
      icon: <SiReact />,
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: "#c770f0" }}>
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
                    bgcolor: "rgba(199, 112, 240, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#c770f0",
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
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

// Main Playground Component
export default function AEMPlayground() {
  const [activeTab, setActiveTab] = useState("architecture");

  return (
    <Container fluid className="project-section" style={{ minHeight: "100vh" }}>
      <Particle />
      <Container>
        <h1 className="project-heading" style={{ paddingTop: "20px" }}>
          <strong className="purple">AEM</strong> + React Playground
        </h1>
        <p style={{ color: "#aaa", textAlign: "center", marginBottom: "30px" }}>
          Interactive demos showing how Adobe Experience Manager integrates with
          React applications
        </p>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Badge
            bg={activeTab === "architecture" ? "primary" : "secondary"}
            style={{ cursor: "pointer", padding: "10px 15px" }}
            onClick={() => setActiveTab("architecture")}
          >
            Architecture
          </Badge>
          <Badge
            bg={activeTab === "content-fragments" ? "primary" : "secondary"}
            style={{ cursor: "pointer", padding: "10px 15px" }}
            onClick={() => setActiveTab("content-fragments")}
          >
            Content Fragments
          </Badge>
          <Badge
            bg={activeTab === "experience-fragments" ? "primary" : "secondary"}
            style={{ cursor: "pointer", padding: "10px 15px" }}
            onClick={() => setActiveTab("experience-fragments")}
          >
            Experience Fragments
          </Badge>
          <Badge
            bg={activeTab === "core-components" ? "primary" : "secondary"}
            style={{ cursor: "pointer", padding: "10px 15px" }}
            onClick={() => setActiveTab("core-components")}
          >
            Core Components
          </Badge>
        </Box>

        <Paper sx={{ p: 3, bgcolor: "rgba(0,0,0,0.5)", borderRadius: 2 }}>
          {activeTab === "architecture" && <ArchitectureFlow />}
          {activeTab === "content-fragments" && <ContentFragmentDemo />}
          {activeTab === "experience-fragments" && <ExperienceFragmentDemo />}
          {activeTab === "core-components" && <CoreComponentsDemo />}
        </Paper>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#666" }}>
            This playground simulates AEM-React integration patterns. In
            production, data comes from actual AEM instances.
          </Typography>
        </Box>
      </Container>
    </Container>
  );
}
