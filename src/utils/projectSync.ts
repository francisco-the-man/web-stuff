import { ProjectData } from '../context/ProjectContext';
import { loadProjects } from './projectLoader';

// Constants
export const LOCAL_STORAGE_KEY = 'personal_website_projects';

/**
 * Synchronizes projects between local storage and the CMS
 * This is used to ensure consistent project data across both systems
 */
export const syncProjectsWithCMS = async (): Promise<ProjectData[]> => {
  try {
    // Load projects from CMS (JSON files)
    const cmsProjects = await loadProjects();
    
    // Get the locally stored projects if available
    const localStorageProjects = getLocalStorageProjects();
    
    if (!localStorageProjects || localStorageProjects.length === 0) {
      // If no local projects, use CMS projects
      console.log('No local projects found, using CMS projects');
      saveProjectsToLocalStorage(cmsProjects);
      return cmsProjects;
    }
    
    // Projects in local storage but not in CMS (might have been deleted in CMS)
    const localProjectsToRemove = localStorageProjects.filter(localProject => 
      !cmsProjects.some(cmsProject => cmsProject.fileName === localProject.fileName)
    );
    
    // Projects in CMS but not in local storage (newly added in CMS)
    const cmsProjectsToAdd = cmsProjects.filter(cmsProject => 
      !localStorageProjects.some(localProject => localProject.fileName === cmsProject.fileName)
    );
    
    // Projects that exist in both places (might need updating)
    const projectsToUpdate = localStorageProjects.filter(localProject => 
      cmsProjects.some(cmsProject => cmsProject.fileName === localProject.fileName)
    ).map(localProject => {
      // Find the matching CMS project
      const cmsProject = cmsProjects.find(p => p.fileName === localProject.fileName);
      
      // Check if local project has updated order/id that should be preserved
      if (cmsProject) {
        return {
          ...cmsProject,
          // Preserve the id from local storage to maintain ordering
          id: localProject.id
        };
      }
      
      return localProject;
    });
    
    // Create the final merged project list
    const mergedProjects = [
      ...projectsToUpdate,
      ...cmsProjectsToAdd
    ].filter(project => 
      // Filter out any projects that are in the "to remove" list
      !localProjectsToRemove.some(p => p.fileName === project.fileName)
    );
    
    // Sort by ID to ensure consistent order
    const sortedProjects = mergedProjects.sort((a, b) => a.id - b.id);
    
    // Update local storage with the merged result
    saveProjectsToLocalStorage(sortedProjects);
    
    console.log(`Synchronized projects: ${sortedProjects.length} projects (${cmsProjectsToAdd.length} added, ${localProjectsToRemove.length} removed, ${projectsToUpdate.length} updated)`);
    
    return sortedProjects;
  } catch (error) {
    console.error('Error synchronizing projects:', error);
    // In case of error, return what's in local storage or an empty array
    return getLocalStorageProjects() || [];
  }
};

/**
 * Gets projects from local storage
 */
export const getLocalStorageProjects = (): ProjectData[] | null => {
  try {
    const savedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedProjects ? JSON.parse(savedProjects) : null;
  } catch (error) {
    console.error('Failed to get projects from localStorage:', error);
    return null;
  }
};

/**
 * Saves projects to local storage
 */
export const saveProjectsToLocalStorage = (projects: ProjectData[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects to localStorage:', error);
  }
};

/**
 * Reindex project IDs to ensure they're sequential
 * This is useful after reordering or removing projects
 */
export const reindexProjectIds = (projects: ProjectData[]): ProjectData[] => {
  return projects.map((project, index) => ({
    ...project,
    id: index
  }));
}; 