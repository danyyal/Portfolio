import type { JSX } from "react";
import GoogleNanoBanana from "./components/GoogleNanoBanana/GoogleNanoBanana";
import DeepWindowWithMaterialUi from "./components/DeepWindowWithMaterialUi";
import ViewerMain from "./components/GLTFViewer/ViewerMain";
import AEMPlayground from "./components/AEMPlayground";
import DocumentToCodeTransform from "./components/DocumentToCodeTransform";

export type RouteConfig = {
  text: string;
  link: string;
  component: () => JSX.Element;
};

export const otherRoutes: RouteConfig[] = [
  {
    text: "Vryo Image Generator",
    link: "/vyro-ai",
    component: () => <GoogleNanoBanana />,
  },
  {
    text: "MaterialUI Examples",
    link: "/material-ui-examples",
    component: () => <DeepWindowWithMaterialUi />,
  },
  {
    text: "Three JS Examples",
    link: "/threejs",
    component: () => <ViewerMain />,
  },
  {
    text: "AEM Playground",
    link: "/aem-playground",
    component: () => <AEMPlayground />,
  },
  {
    text: "Document to Code",
    link: "/doc-to-code",
    component: () => <DocumentToCodeTransform />,
  },
];
