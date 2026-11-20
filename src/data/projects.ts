import drevise from "../Assets/Projects/drevise.webp";
import dataregistry from "../Assets/Projects/dataregistry.webp";
import lebara from "../Assets/Projects/lebara.webp";
import yjsg from "../Assets/Projects/yjsg.webp";
import spacedventures from "../Assets/Projects/spacedventures.webp";
import riskcomply from "../Assets/Projects/riskcomply.webp";
import liftoffleads from "../Assets/Projects/liftoffleads.webp";
import fridaypos from "../Assets/Projects/fridaypos.webp";
import tambr from "../Assets/Projects/tambr.webp";
import portalio from "../Assets/Projects/portalio.webp";

export type Project = {
  title: string;
  imgPath: string;
  descriptionKey: string;
  /** one line, shown where there is no room for the full description */
  summaryKey: string;
  demoLink?: string;
  ghLink?: string;
  isPrivate?: boolean;
};

export const projects: Project[] = [
  {
    title: "Drevise",
    imgPath: drevise,
    descriptionKey: "projects.dreviseDesc",
    summaryKey: "projects.dreviseSummary",
    demoLink: "https://drevise.com/",
    isPrivate: true,
  },
  {
    title: "Data Registry",
    imgPath: dataregistry,
    descriptionKey: "projects.dataregistryDesc",
    summaryKey: "projects.dataregistrySummary",
    demoLink: "/demos/data-registry.mp4",
    isPrivate: true,
  },
  {
    title: "Lebara (AEM + React)",
    imgPath: lebara,
    descriptionKey: "projects.lebaraDesc",
    summaryKey: "projects.lebaraSummary",
    demoLink: "https://www.lebara.co.uk/en/home.html",
    ghLink: "https://github.com/Lebara-Ltd/storybook",
    isPrivate: true,
  },
  {
    title: "YJSG",
    imgPath: yjsg,
    descriptionKey: "projects.yjsgDesc",
    summaryKey: "projects.yjsgSummary",
    demoLink: "https://jobsearchgenius.ai/",
    isPrivate: true,
  },
  {
    title: "Spaced Ventures",
    imgPath: spacedventures,
    descriptionKey: "projects.spacedventuresDesc",
    summaryKey: "projects.spacedventuresSummary",
    demoLink: "https://www.33fg.com/",
    isPrivate: true,
  },
  {
    title: "Risk Comply",
    imgPath: riskcomply,
    descriptionKey: "projects.riskcomplyDesc",
    summaryKey: "projects.riskcomplySummary",
    demoLink: "https://riskcomply.online",
    isPrivate: true,
  },
  {
    title: "Liftoff Leads",
    imgPath: liftoffleads,
    descriptionKey: "projects.liftoffleadsDesc",
    summaryKey: "projects.liftoffleadsSummary",
    demoLink: "https://portal.liftoffleads.com/",
    isPrivate: true,
  },
  {
    title: "Friday POS",
    imgPath: fridaypos,
    descriptionKey: "projects.fridayposDesc",
    summaryKey: "projects.fridayposSummary",
    demoLink: "https://www.fridaypos.com/",
    isPrivate: true,
  },
  {
    title: "Tambr",
    imgPath: tambr,
    descriptionKey: "projects.tambrDesc",
    summaryKey: "projects.tambrSummary",
    demoLink: "https://www.tambr.app/",
    isPrivate: true,
  },
  {
    title: "Portal.io",
    imgPath: portalio,
    descriptionKey: "projects.portalioDesc",
    summaryKey: "projects.portalioSummary",
    demoLink: "https://portal.io/",
    isPrivate: true,
  },
];

export const featuredProjects = projects.slice(0, 3);
