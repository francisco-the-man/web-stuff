import React, { createContext, useContext, ReactNode } from 'react';
import { loadProjects } from '../utils/projectLoader';

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

export interface ProjectContextType {
  projects: ProjectData[];
}

// Loaded once at module scope — project JSON is bundled at build time
const projects = loadProjects();

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ProjectContext.Provider value={{ projects }}>
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
