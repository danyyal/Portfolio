/* One source for who I am and what I have built. Both site modes read from
   here, so the classic pages and mission mode can never disagree. */

export const profile = {
  name: "Danyyal Ali",
  fullName: "Danyyal Ali Yar",
  role: "Senior Full-Stack AI Engineer",
  company: "Drevise",
  companyUrl: "https://drevise.com",
  location: "Lahore, Pakistan",
  email: "danyyal.ali.31@gmail.com",
  github: "https://github.com/danyyal",
  linkedin: "https://www.linkedin.com/in/sheikh-danyyal-ali-08b768193/",
  lede: "I build the product end to end: the React and NestJS platform, the 3D and machining simulations inside it, and the computer-vision models that read engineering drawings.",
  record: [
    { key: "Name", value: "Danyyal Ali Yar" },
    { key: "Role", value: "Senior Full-Stack AI Engineer" },
    { key: "Station", value: "Drevise · remote, Germany" },
    { key: "Base", value: "Lahore, Pakistan" },
    {
      key: "Focus",
      value: "Computer vision, 3D simulation, full-stack platforms",
    },
    { key: "Education", value: "BSc Computer Science, GCU Lahore" },
    { key: "Off duty", value: "Badminton, books, travelling" },
  ],
};

export type Stat = { value: string; label: string };

export const heroStats: Stat[] = [
  { value: "6+", label: "Years shipping" },
  { value: "25+", label: "Projects delivered" },
  { value: "49", label: "Model weights in production" },
  { value: "1M+", label: "Labelled training crops" },
];

export type AiModel = {
  name: string;
  /** what kind of problem it solves */
  task: string;
  detail: string;
  /** a measured result or a deployment fact; never decoration */
  readout?: string;
};

export const aiModels: AiModel[] = [
  {
    name: "DBNet++ text detection",
    task: "Text detection",
    detail:
      "Finds every text box on an engineering drawing, run over 1600 px tiles. A lighter DBNet + MobileNetV3 variant handles the infoblock at 1920×1344.",
    readout: "538k text instances · 11.7k images",
  },
  {
    name: "DBNet character detection",
    task: "Character detection",
    detail:
      "Per-character heatmap detector (ResNet-50 + FPN) that resolves text rotation and masks glyphs for the character remover.",
    readout: "128 px crops · OpenVINO",
  },
  {
    name: "CRAFT",
    task: "Character detection",
    detail:
      "Replaced the DBNet character detector as the default in the OCR rotation pipeline after a head-to-head on 1,625 held-out crops, alongside a CRAFT vs YOLO comparison.",
    readout: "Exact character count 73.0 % → 98.9 %",
  },
  {
    name: "PaddleOCR",
    task: "Text recognition",
    detail:
      "PP-OCRv3 recogniser fine-tuned on 62k drawing crops with a 108-character dictionary, a PP-OCRv5 recogniser for GD&T, and PP-OCRv6 detection. All served through OpenVINO.",
    readout: "96.7 % character accuracy · ~6 ms per crop",
  },
  {
    name: "LayoutLM v1 · v2 · v3",
    task: "Document understanding",
    detail:
      "Reads the infoblock as text plus layout: sensitive-data detection across five label types and extraction of 22 fields. v1 runs in production, exported PyTorch → ONNX → OpenVINO for CPU Lambda.",
    readout: "96.5 % token accuracy · F1 0.861",
  },
  {
    name: "5-class symbol detector",
    task: "Oriented object detection",
    detail:
      "One YOLO11l-OBB model finds surface roughness, chamfer, edge tolerance, GD&T and welding symbols as rotated boxes, replacing three separate detectors.",
    readout: "mAP50 0.992 · mAP50-95 0.977",
  },
  {
    name: "Nano symbol detector",
    task: "Oriented object detection",
    detail:
      "YOLO26n-OBB. The pipeline's property detector: the same five symbol classes on 640 px windows, for close-up confirmation.",
    readout: "mAP50-95 0.980 \u00b7 182k crops",
  },
  {
    name: "Drawing-area segmentation",
    task: "Segmentation",
    detail:
      "YOLOv8s-seg. Masks the part of the page that is the drawing, apart from frame, infoblock and margins.",
    readout: "Mask mAP50-95 0.989",
  },
  {
    name: "Logo detector",
    task: "Object detection",
    detail:
      "YOLO11s. Finds the company logo in the infoblock so a drawing can be anonymised.",
    readout: "Precision 0.999 \u00b7 recall 0.994",
  },
  {
    name: "GD&T cell detector",
    task: "Object detection",
    detail:
      "YOLO11n. Splits a GD&T frame into its cells so each one can be read on its own.",
    readout: "mAP50 0.994 \u00b7 mAP50-95 0.946",
  },
  {
    name: "Edge-tolerance symbol detector",
    task: "Object detection",
    detail:
      "YOLO11n. Finds the small L-shaped edge-tolerance symbol; trained on 609 crops.",
    readout: "mAP50 0.991",
  },
  {
    name: "View detector",
    task: "Object detection",
    detail:
      "YOLO11m. A first, box-based attempt at finding views, before the segmentation models.",
    readout: "mAP50 0.954",
  },
  {
    name: "RF-DETR-Seg",
    task: "Instance segmentation",
    detail:
      "Segments the individual views on a drawing page. Trained on 8 GPUs at 2544 px and compared with YOLO-seg on the same 46-page test set.",
    readout: "Precision 0.970 · recall 0.978",
  },
  {
    name: "LightGBM",
    task: "Note-block grouping",
    detail:
      "Pairwise classifier over 43 layout features plus multilingual text signals that decides which lines on a drawing belong to the same note.",
    readout: "F1 0.697 → 0.785 · 50–150 ms per drawing",
  },
  {
    name: "LAYA",
    task: "Demo",
    detail: "A model playing the Snake game, built as a demo.",
  },
];

export type SystemCard = {
  title: string;
  kicker: string;
  body: string;
  stats: Stat[];
  tech: string[];
};

export const systems: SystemCard[] = [
  {
    title: "Data Registry",
    kicker: "Data platform",
    body: "A Python application I own end to end: the single source of truth for every drawing, training crop and label behind the models. Images are stored once, labels live in one store, and each project only references ids. A resolver assembles any training layout on demand and an ingest airlock validates new data before it lands.",
    stats: [
      { value: "1.08M", label: "Training crops" },
      { value: "50.9k", label: "Drawing pages" },
      { value: "21", label: "Projects" },
      { value: "113 GB", label: "Shipped through DVC" },
    ],
    tech: ["Python", "Flask", "SQLite", "DVC", "S3", "GitHub Actions"],
  },
  {
    title: "3D & simulation",
    kicker: "CAD in the browser",
    body: "STEP models open directly in the browser through a CAD kernel compiled to WebAssembly and rendered with Three.js. On top of that sit machining simulations: run-time estimates for turned, milled, sheet and tube parts, with a 3D replay of how the part is cut.",
    stats: [
      { value: "4", label: "Machining lanes simulated" },
      { value: "732", label: "Parts in the validation batch" },
    ],
    tech: [
      "Three.js",
      "React Three Fiber",
      "OpenCascade",
      "WebAssembly",
      "Web Workers",
    ],
  },
  {
    title: "Extraction pipeline",
    kicker: "Serverless ML",
    body: "A drawing goes in, structured manufacturing data comes out. The pipeline picks a render resolution, tiles the page, runs detection, OCR and classification in parallel, then places balloons and posts the result to the platform.",
    stats: [
      { value: "53", label: "Lambda functions" },
      { value: "106", label: "Workflow states" },
      { value: "47", label: "OpenVINO models" },
      { value: "5.2k", label: "Automated tests" },
    ],
    tech: ["AWS Step Functions", "Lambda", "OpenVINO", "Terraform", "Python"],
  },
];

export type TimelineEntry = {
  period: string;
  isCurrent?: boolean;
  role: string;
  company: string;
  location: string;
  summary: string;
  highlights: string[];
  tech: string[];
};

export const career: TimelineEntry[] = [
  {
    period: "10/2023 — Present",
    isCurrent: true,
    role: "Senior Full-Stack AI Engineer",
    company: "Drevise",
    location: "Remote — Germany",
    summary:
      "AI platform for contract manufacturers: it reads engineering drawings, builds inspection reports and estimates machining time from 3D models.",
    highlights: [
      "Full-stack across the product: React and TypeScript front end, NestJS API and PostgreSQL, from data model to shipped screen",
      "Build and run the serverless pipeline behind it: AWS Lambda functions orchestrated with Step Functions, provisioned in Terraform",
      "Train and ship the computer-vision models that read drawings: text and symbol detection, OCR, layout understanding",
      "Built in-browser 3D viewing of STEP models and machining simulations for turned, milled, sheet and tube parts",
      "Own the Python Data Registry behind every model: 1.08 million training crops, 50.9k drawings, 21 projects",
    ],
    tech: [
      "React",
      "TypeScript",
      "NestJS",
      "PostgreSQL",
      "Python",
      "AWS Lambda",
      "Step Functions",
      "Terraform",
      "Three.js",
      "OpenVINO",
    ],
  },
  {
    period: "04/2025 — 04/2026",
    role: "Senior Software Engineer",
    company: "Confiz (× Lebara)",
    location: "Lahore, Pakistan",
    summary:
      "Drove digital innovation for Lebara, a global telco serving millions of users across Europe.",
    highlights: [
      "Migrated the React front end to Next.js, cutting page load times",
      "Raised performance and scalability through code optimization and best practices",
      "Guarded code quality through structured code reviews",
    ],
    tech: ["Next.js", "React", "TypeScript", "AEM", "GraphQL", "Storybook"],
  },
  {
    period: "12/2023 — 04/2025",
    role: "Senior Software Engineer",
    company: "i2c Inc.",
    location: "Lahore, Pakistan",
    summary:
      "Fintech platform work on card-management products used by global banking clients.",
    highlights: [
      "Pioneered integration of advanced tooling, speeding up project delivery",
      "Mentored junior developers through rigorous code reviews",
      "Restructured legacy code for cleaner, faster applications",
    ],
    tech: ["React", "TypeScript", "Redux", "REST APIs", "MySQL"],
  },
  {
    period: "04/2020 — 12/2023",
    role: "Software Engineer",
    company: "Techverx",
    location: "Lahore, Pakistan",
    summary:
      "Full-stack delivery across client products — compliance platforms, lead-gen portals, space-industry fintech, and drone control apps.",
    highlights: [
      "Delivered RiskComply, Liftoff Leads, Spaced Ventures, a drone app, and TTS end-to-end",
      "Optimized application performance, materially reducing load times",
      "Built lasting client relationships through communication and reliability",
    ],
    tech: ["React", "Node.js", "MongoDB", "Socket.IO", "Stripe", "Firebase"],
  },
];

export const skillGroups: { title: string; items: string[] }[] = [
  {
    title: "AI / ML",
    items: [
      "PyTorch",
      "YOLO",
      "DBNet++",
      "CRAFT",
      "PaddleOCR",
      "LayoutLM",
      "RF-DETR",
      "LightGBM",
      "OpenVINO",
      "ONNX",
      "OpenCV",
      "DVC",
      "SageMaker",
    ],
  },
  {
    title: "3D & simulation",
    items: [
      "Three.js",
      "React Three Fiber",
      "WebGL",
      "OpenCascade",
      "WebAssembly",
      "GLTF",
      "STEP",
    ],
  },
  {
    title: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Angular",
      "TanStack Query",
      "Tailwind CSS",
      "Fabric.js",
      "Storybook",
    ],
  },
  {
    title: "Backend",
    items: [
      "Node.js",
      "NestJS",
      "Python",
      "Flask",
      "GraphQL",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Socket.IO",
    ],
  },
  {
    title: "Cloud",
    items: [
      "AWS Lambda",
      "Step Functions",
      "Terraform",
      "Docker",
      "S3",
      "GitHub Actions",
    ],
  },
];
