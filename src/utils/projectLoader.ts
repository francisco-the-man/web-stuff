import { ProjectData } from '../context/ProjectContext';

// This function loads projects from the JSON files in the _projects directory
// and assigns IDs automatically if they don't exist
export const loadProjects = async (): Promise<ProjectData[]> => {
  // Add timestamp to avoid caching issues during development
  const timestamp = Date.now();
  console.log(`Loading projects at timestamp: ${timestamp}`);
  
  try {
    const projectModules = import.meta.glob('../_projects/*.json', { eager: true });
    
    // Log the found project files to help with debugging
    console.log('Found project files:', Object.keys(projectModules));
    
    if (Object.keys(projectModules).length === 0) {
      console.warn('No project files found. Using default projects.');
      return getDefaultProjects();
    }
    
    // Convert the modules object to an array of project data
    let projects: ProjectData[] = Object.values(projectModules).map(
      (module: any, index: number) => {
        try {
          const projectData = module.default || module;
          
          // Validate required fields (except ID which we'll handle automatically)
          if (!projectData.fileName || !projectData.projectTitle) {
            console.warn('Invalid project data (missing required fields):', projectData);
            return null;
          }
          
          // Add a fallback image if the image doesn't exist
          if (!projectData.projectImg || projectData.projectImg === "") {
            projectData.projectImg = "/vite.svg"; // Use a known image that exists
          }
          
          // Ensure image path starts with / 
          if (projectData.projectImg && !projectData.projectImg.startsWith('/')) {
            projectData.projectImg = '/' + projectData.projectImg;
          }
          
          // Ensure project type has matching required fields
          if (projectData.type === 'written' && !projectData.authorNames) {
            console.warn(`Project "${projectData.fileName}" is missing authorNames which is required for "written" type`);
            // Add empty authorNames to prevent errors
            projectData.authorNames = '';
          }
          
          if (projectData.type === 'computational' && !projectData.repoLink) {
            console.warn(`Project "${projectData.fileName}" is missing repoLink which is required for "computational" type`);
            // Add placeholder repoLink to prevent errors
            projectData.repoLink = '#';
          }
          
          // Return the project data with all fields validated
          return projectData;
        } catch (error) {
          console.error('Error processing project module:', error);
          return null;
        }
      }
    ).filter(Boolean) as ProjectData[];
    
    // If no valid projects were found after processing, use defaults
    if (projects.length === 0) {
      console.warn('No valid projects found after processing. Using default projects.');
      return getDefaultProjects();
    }
    
    // Sort projects alphabetically by fileName first 
    // This ensures a consistent initial order before ID assignment
    projects.sort((a, b) => a.fileName.localeCompare(b.fileName));
    
    // Automatically assign IDs to projects based on their position in the array
    // This ensures we don't have duplicate IDs and maintains order
    projects = projects.map((project, index) => ({
      ...project,
      // Use existing ID if available, otherwise assign based on index
      id: project.id !== undefined ? project.id : index
    }));
    
    // Final sort by ID to ensure consistent display order
    return projects.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error('Error loading projects:', error);
    return getDefaultProjects();
  }
};

// Default projects to use in development or if no CMS projects are found
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