import { ProjectData } from '../context/ProjectContext';

// Projects are stored as JSON files in src/_projects (edited via /admin).
// They are bundled at build time — no runtime fetching.
const projectModules = import.meta.glob<ProjectData>('../_projects/*.json', {
  eager: true,
  import: 'default',
});

export const loadProjects = (): ProjectData[] => {
  return Object.values(projectModules)
    .map((project) => ({ ...project }))
    .sort((a, b) => a.id - b.id);
};
