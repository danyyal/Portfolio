import { lazy, type ComponentType } from "react";

// Heavy playground pages (Three.js, MUI, image generation) are code-split so
// the main portfolio bundle stays lean. App wraps each in <Suspense>.
const DeepWindowWithMaterialUi = lazy(
  () => import("./components/DeepWindowWithMaterialUi"),
);
const ViewerMain = lazy(() => import("./components/GLTFViewer/ViewerMain"));
const AEMPlayground = lazy(() => import("./components/AEMPlayground"));
const DocumentToCodeTransform = lazy(
  () => import("./components/DocumentToCodeTransform"),
);
const ChartsShowcase = lazy(() => import("./components/ChartsShowcase"));
const ShadcnShowcase = lazy(() => import("./components/ShadcnShowcase"));

export type RouteConfig = {
  text: string;
  link: string;
  component: ComponentType;
};

export const otherRoutes: RouteConfig[] = [
  {
    text: "MaterialUI Examples",
    link: "/material-ui-examples",
    component: DeepWindowWithMaterialUi,
  },
  {
    text: "Three JS Examples",
    link: "/threejs",
    component: ViewerMain,
  },
  {
    text: "AEM Playground",
    link: "/aem-playground",
    component: AEMPlayground,
  },
  {
    text: "Document to Code",
    link: "/doc-to-code",
    component: DocumentToCodeTransform,
  },
  {
    text: "Chart.js Data Studio",
    link: "/charts",
    component: ChartsShowcase,
  },
  {
    text: "shadcn/ui Lab",
    link: "/shadcn-ui",
    component: ShadcnShowcase,
  },
];
