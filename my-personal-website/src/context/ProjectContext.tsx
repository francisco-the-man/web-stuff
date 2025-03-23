import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { loadProjects, getDefaultProjects } from '../utils/projectLoader';

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
}

// Get default projects (used as fallback)
const initialProjects: ProjectData[] = getDefaultProjects();

// Local Storage key
const STORAGE_KEY = 'personal_website_projects';

interface ProjectContextType {
  projects: ProjectData[];
  addProject: (project: Omit<ProjectData, 'id'>) => void;
  updateProject: (project: ProjectData) => void;
  deleteProject: (id: number) => void;
  // A way to reset to original projects if needed
  resetProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectData[]>(() => {
    // Try to get projects from localStorage
    const savedProjects = localStorage.getItem(STORAGE_KEY);
    if (savedProjects) {
      try {
        return JSON.parse(savedProjects);
      } catch (error) {
        console.error('Failed to parse saved projects:', error);
        return initialProjects;
      }
    }
    return initialProjects;
  });

  // Load projects from CMS files when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const cmsProjects = await loadProjects();
        if (cmsProjects && cmsProjects.length > 0) {
          setProjects(cmsProjects);
          // Update localStorage with the CMS projects
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cmsProjects));
        }
      } catch (error) {
        console.error('Failed to load CMS projects:', error);
      }
    };
    
    fetchProjects();
  }, []);

  // Save to localStorage when projects change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Omit<ProjectData, 'id'>) => {
    const newId = projects.length > 0 
      ? Math.max(...projects.map(p => p.id)) + 1 
      : 1;
      
    setProjects([...projects, { ...project, id: newId }]);
  };

  const updateProject = (updatedProject: ProjectData) => {
    setProjects(projects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ));
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const resetProjects = () => {
    // Reset to CMS projects or fallback to initial projects
    loadProjects()
      .then(cmsProjects => {
        if (cmsProjects && cmsProjects.length > 0) {
          setProjects(cmsProjects);
        } else {
          setProjects(initialProjects);
        }
      })
      .catch(() => {
        setProjects(initialProjects);
      });
  };

  return (
    <ProjectContext.Provider 
      value={{ 
        projects, 
        addProject, 
        updateProject, 
        deleteProject,
        resetProjects
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}; 