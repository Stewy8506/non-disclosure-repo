export type Project = {
  id?: string;
  title: string;
  description?: string;
  overview?: string;
  problem?: string;
  category?: string;
  date?: string;
  tech?: string[];
  image?: string;
  images?: string[];
  hasLiveDemo?: boolean;
  liveDemoUrl?: string;
  link?: string;
  sourceCodeUrl?: string;
};

export function isWebsiteProject(project: Pick<Project, "category">) {
  const category = project.category?.toLowerCase() || "";
  return category.includes("web") || category.includes("website");
}

export function getProjectLiveUrl(project: Project) {
  if (!isWebsiteProject(project) || project.hasLiveDemo === false) return "";
  return project.liveDemoUrl || project.link || "";
}
