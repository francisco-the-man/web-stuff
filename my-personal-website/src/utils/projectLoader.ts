import { ProjectData } from '../context/ProjectContext';

// This is a placeholder function that Vite will use at build time to import all project files
// In a real implementation, this would dynamically load all JSON files from the _projects directory
export const loadProjects = async (): Promise<ProjectData[]> => {
  const projectModules = import.meta.glob('../_projects/*.json', { eager: true });
  
  // Convert the modules object to an array of project data
  const projects: ProjectData[] = Object.values(projectModules).map(
    (module: any) => module.default || module
  );
  
  // Sort projects by id
  return projects.sort((a, b) => a.id - b.id);
};

// Default projects to use in development or if no CMS projects are found
export const getDefaultProjects = (): ProjectData[] => {
  return [
    {
      id: 1,
      fileName: "MetaSci",
      projectTitle: "Diffusion Models & Memory",
      projectImg: "/brain-neuron.jpg",
      description: "Drawing some mathematical analogies between diffusion models and hopfield network models of associative memory. It turns out that diffusion models might be a very good biological model of fallible memory.",
      type: "written",
      position: "left",
      category: "research",
      authorNames: "Avery Louis (me) & Sisely Dalisi",
    },
    {
      id: 2,
      fileName: "DDPMs",
      projectTitle: "Chaos Effect",
      projectImg: "/chaos-effect.jpg",
      description: "An interactive physics-based animation that brings chaos to order and back again, exploring the concepts of entropy and organization.",
      type: "computational",
      position: "middle",
      category: "computer",
      repoLink: "https://github.com/francisco-the-man/chaos-effect",
    },
    {
      id: 3,
      fileName: "Genius",
      projectTitle: "Personal Website",
      projectImg: "/website-screenshot.jpg",
      description: "A minimalist personal website built with React and Tailwind CSS, featuring interactive elements and clean typography.",
      type: "computational",
      position: "right",
      category: "both",
      repoLink: "https://github.com/francisco-the-man/personal-website",
    },
  ];
}; 