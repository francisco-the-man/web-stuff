import { ProjectData } from '../context/ProjectContext';
import { fetchProjectsFromNotion } from './notionService';

// This function loads projects from Notion and falls back to default projects if needed
export const loadProjects = async (): Promise<ProjectData[]> => {
  // Add timestamp to avoid caching issues during development
  const timestamp = Date.now();
  console.log(`Loading projects at timestamp: ${timestamp}`);
  
  try {
    // First attempt to fetch projects from Notion
    console.log('Attempting to fetch projects from Notion...');
    const notionProjects = await fetchProjectsFromNotion();
    
    if (notionProjects && notionProjects.length > 0) {
      console.log(`Successfully loaded ${notionProjects.length} projects from Notion`);
      
      // Ensure all projects have the required fields
      const validatedProjects = notionProjects.map((project, index) => {
        // Add a fallback image if the image doesn't exist
        if (!project.projectImg || project.projectImg === "") {
          project.projectImg = "/vite.svg"; // Use a known image that exists
        }
        
        // Ensure image path starts with / 
        if (project.projectImg && !project.projectImg.startsWith('/')) {
          project.projectImg = '/' + project.projectImg;
        }
        
        // Ensure project type has matching required fields
        if (project.type === 'written' && !project.authorNames) {
          console.warn(`Project "${project.fileName}" is missing authorNames which is required for "written" type`);
          // Add empty authorNames to prevent errors
          project.authorNames = '';
        }
        
        if (project.type === 'computational' && !project.repoLink) {
          console.warn(`Project "${project.fileName}" is missing repoLink which is required for "computational" type`);
          // Add placeholder repoLink to prevent errors
          project.repoLink = '#';
        }
        
        return {
          ...project,
          // Ensure ID is set correctly
          id: project.id !== undefined ? project.id : index
        };
      });
      
      // Sort projects by ID to ensure consistent display order
      return validatedProjects.sort((a, b) => a.id - b.id);
    }
    
    // If Notion fetch fails or returns empty, fall back to default projects
    console.warn('No valid projects found from Notion. Using default projects.');
    return getDefaultProjects();
  } catch (error) {
    console.error('Error loading projects from Notion:', error);
    return getDefaultProjects();
  }
};

// Default projects to use in development or if no Notion projects are found
export const getDefaultProjects = (): ProjectData[] => {
  return [
    {
      id: 1,
      fileName: "MetaSci",
      projectTitle: "Diffusion Models & Memory",
      projectImg: "/projects/images/img-kant.png",
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
      projectImg: "/projects/images/img_5776.jpg",
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
      projectImg: "/projects/images/img-bb.png",
      description: "A minimalist personal website built with React and Tailwind CSS, featuring interactive elements and clean typography.",
      type: "computational",
      position: "right",
      category: "both",
      repoLink: "https://github.com/francisco-the-man/personal-website",
    },
  ];
}; 