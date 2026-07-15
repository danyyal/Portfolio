import cerpro from "../Assets/Projects/cerpro.png";
import lebara from "../Assets/Projects/lebara.png";
import yjsg from "../Assets/Projects/yjsg.png";
import spacedventures from "../Assets/Projects/spacedventures.png";
import riskcomply from "../Assets/Projects/riskcomply.png";
import liftoffleads from "../Assets/Projects/liftoffleads.png";
import fridaypos from "../Assets/Projects/fridaypos.png";
import tambr from "../Assets/Projects/tambr.png";
import portalio from "../Assets/Projects/portalio.png";

export type Project = {
  title: string;
  imgPath: string;
  descriptionKey: string;
  demoLink?: string;
  ghLink?: string;
  isPrivate?: boolean;
};

export const projects: Project[] = [
  {
    title: "Lebara (AEM + React)",
    imgPath: lebara,
    descriptionKey: "projects.lebaraDesc",
    demoLink: "https://www.lebara.co.uk/en/home.html",
    ghLink: "https://github.com/Lebara-Ltd/storybook",
    isPrivate: true,
  },
  {
    title: "CERPRO",
    imgPath: cerpro,
    descriptionKey: "projects.cerproDesc",
    demoLink: "https://platform.cerpro.io",
    ghLink: "https://github.com/saschamuellercerpro/cerpro",
    isPrivate: true,
  },
  {
    title: "YJSG",
    imgPath: yjsg,
    descriptionKey: "projects.yjsgDesc",
    demoLink: "https://jobsearchgenius.ai/",
    isPrivate: true,
  },
  {
    title: "Spaced Ventures",
    imgPath: spacedventures,
    descriptionKey: "projects.spacedventuresDesc",
    demoLink: "https://www.33fg.com/",
    isPrivate: true,
  },
  {
    title: "Risk Comply",
    imgPath: riskcomply,
    descriptionKey: "projects.riskcomplyDesc",
    demoLink: "https://riskcomply.online",
    isPrivate: true,
  },
  {
    title: "Liftoff Leads",
    imgPath: liftoffleads,
    descriptionKey: "projects.liftoffleadsDesc",
    demoLink: "https://portal.liftoffleads.com/",
    isPrivate: true,
  },
  {
    title: "Friday POS",
    imgPath: fridaypos,
    descriptionKey: "projects.fridayposDesc",
    demoLink: "https://www.fridaypos.com/",
    isPrivate: true,
  },
  {
    title: "Tambr",
    imgPath: tambr,
    descriptionKey: "projects.tambrDesc",
    demoLink: "https://www.tambr.app/",
    isPrivate: true,
  },
  {
    title: "Portal.io",
    imgPath: portalio,
    descriptionKey: "projects.portalioDesc",
    demoLink: "https://portal.io/",
    isPrivate: true,
  },
];

export const featuredProjects = projects.slice(0, 3);