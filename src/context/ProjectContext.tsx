import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { loadProjects, getDefaultProjects } from '../utils/projectLoader';
import { syncProjectsWithCMS, LOCAL_STORAGE_KEY, reindexProjectIds } from '../utils/projectSync';
import { testNotionConnection } from '../utils/notionService';

// Types from ProjectFolder component
export type ProjectType = 'written' | 'computational';
export type FolderPosition = 'left' | 'middle' | 'right';
export type ProjectCategory = 'research' | 'computer' | 'both';

export interface ProjectData {
  id: number;
  fileName: string;
  projectTitle: string;
  projectImg: string;
  description: string;
  type: ProjectType;
  position: FolderPosition;
  category: ProjectCategory;
  authorNames?: string;
  repoLink?: string;
  projectSlug?: string;
}

// Get default projects (used as fallback)
const initialProjects: ProjectData[] = getDefaultProjects();

export interface ProjectContextType {
  projects: ProjectData[];
  addProject: (project: Omit<ProjectData, 'id'>) => void;
  updateProject: (project: ProjectData) => void;
  deleteProject: (id: number) => void;
  // A way to reset to original projects if needed
  resetProjects: () => void;
  // Add a refresh function
  refreshProjects: () => Promise<void>;
  // Add function to reorder projects by dragging
  reorderProjects: (fromIndex: number, toIndex: number) => void;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(true);

  // Create a reusable refresh function
  const refreshProjects = useCallback(async () => {
    console.log("Refreshing projects from Notion...");
    setIsLoading(true);
    
    try {
      // Test Notion connection first
      const isNotionConnected = await testNotionConnection();
      
      if (isNotionConnected) {
        console.log("Notion connection successful, loading projects...");
        // Use the project loader to fetch data from Notion
        const notionProjects = await loadProjects();
        
        if (notionProjects && notionProjects.length > 0) {
          console.log("Successfully loaded projects from Notion:", notionProjects);
          setProjects(notionProjects);
          // Update local storage with Notion data
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notionProjects));
        } else {
          console.log("No projects found in Notion, using defaults");
          setProjects(initialProjects);
        }
      } else {
        console.warn("Notion connection failed, trying to load from localStorage");
        // Try to use localStorage as fallback
        const savedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedProjects) {
          try {
            setProjects(JSON.parse(savedProjects));
          } catch (error) {
            console.error('Failed to parse saved projects:', error);
            setProjects(initialProjects);
          }
        } else {
          console.log("No localStorage backup, using defaults");
          setProjects(initialProjects);
        }
      }
    } catch (error) {
      console.error('Failed to refresh projects:', error);
      // If loading fails, try to use localStorage as fallback
      const savedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedProjects) {
        try {
          setProjects(JSON.parse(savedProjects));
        } catch (error) {
          console.error('Failed to parse saved projects:', error);
          setProjects(initialProjects);
        }
      } else {
        console.log("Error occurred and no localStorage backup, using defaults");
        setProjects(initialProjects);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to reorder projects by dragging
  const reorderProjects = (fromIndex: number, toIndex: number) => {
    setProjects(prevProjects => {
      // Make a copy of the projects array
      const updatedProjects = [...prevProjects];
      
      // Remove the project from the fromIndex
      const [movedProject] = updatedProjects.splice(fromIndex, 1);
      
      // Insert the project at the toIndex
      updatedProjects.splice(toIndex, 0, movedProject);
      
      // Update IDs to reflect new order
      return reindexProjectIds(updatedProjects);
    });
  };

  // Load projects when the component mounts
  useEffect(() => {
    refreshProjects();
    
    // Set up a refresh interval in development
    if (import.meta.env.DEV) {
      const intervalId = setInterval(() => {
        refreshProjects();
      }, 60000); // Refresh every minute during development
      
      return () => clearInterval(intervalId);
    }
  }, [refreshProjects]);

  // Save to localStorage when projects change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Omit<ProjectData, 'id'>) => {
    setProjects(prevProjects => {
      const newId = prevProjects.length > 0 
        ? Math.max(...prevProjects.map(p => p.id)) + 1 
        : 1;
        
      return [...prevProjects, { ...project, id: newId }];
    });
  };

  const updateProject = (updatedProject: ProjectData) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  const deleteProject = (id: number) => {
    setProjects(prevProjects => {
      // First filter out the deleted project
      const filteredProjects = prevProjects.filter(project => project.id !== id);
      // Then reindex to ensure sequential IDs
      return reindexProjectIds(filteredProjects);
    });
  };

  const resetProjects = () => {
    // Reset to defaults and trigger a refresh
    setProjects(initialProjects);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialProjects));
    refreshProjects();
  };

  return (
    <ProjectContext.Provider 
      value={{ 
        projects, 
        addProject, 
        updateProject, 
        deleteProject,
        resetProjects,
        refreshProjects,
        reorderProjects,
        isLoading
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

// Named export for the hook to be compatible with Fast Refresh
export function useProjects(): ProjectContextType {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
} 