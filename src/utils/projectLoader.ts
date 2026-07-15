import { ProjectData } from '../context/ProjectContext';
import orderConfig from '../_content/project-order.json';

// Projects are stored as JSON files in src/_projects (edited via /admin).
// They are bundled at build time — no runtime fetching.
const projectModules = import.meta.glob<Omit<ProjectData, 'slug'>>('../_projects/*.json', {
  eager: true,
  import: 'default',
});

const allProjects: ProjectData[] = Object.entries(projectModules).map(([path, project]) => ({
  ...project,
  slug: path.split('/').pop()!.replace(/\.json$/, ''),
}));

// Order comes from src/_content/project-order.json (drag-and-drop in /admin).
// Projects missing from the order list go last, alphabetically.
const orderedForPage = (page: 'computer' | 'research', orderList: string[]): ProjectData[] => {
  const rank = new Map(orderList.map((slug, index) => [slug, index]));
  return allProjects
    .filter((project) => project.category === page || project.category === 'both')
    .sort(
      (a, b) =>
        (rank.get(a.slug) ?? Infinity) - (rank.get(b.slug) ?? Infinity) ||
        a.fileName.localeCompare(b.fileName)
    );
};

export const loadComputerProjects = (): ProjectData[] =>
  orderedForPage('computer', orderConfig.computer);

export const loadResearchProjects = (): ProjectData[] =>
  orderedForPage('research', orderConfig.research);
