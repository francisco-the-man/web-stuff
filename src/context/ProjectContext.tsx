import React, { createContext, useContext, ReactNode } from 'react';
import { loadComputerProjects, loadResearchProjects } from '../utils/projectLoader';

// Types from ProjectFolder component
export type ProjectType = 'written' | 'computational';
export type FolderPosition = 'left' | 'middle' | 'right';
export type ProjectCategory = 'research' | 'computer' | 'both';

export interface ProjectData {
  slug: string;
  fileName: string;
  projectTitle: string;
  projectImg: string;
  description: string;
  type: ProjectType;
  category: ProjectCategory;
  authorNames?: string;
  repoLink?: string;
  linkLabel?: string;
  linkUrl?: string;
  projectSlug?: string;
}

// Folder-tab position cycles with display order: 1st left, 2nd middle, 3rd right, repeat
export const positionForIndex = (index: number): FolderPosition =>
  (['left', 'middle', 'right'] as const)[index % 3];

export interface ProjectContextType {
  computerProjects: ProjectData[];
  researchProjects: ProjectData[];
}

// Loaded once at module scope — project JSON is bundled at build time
const computerProjects = loadComputerProjects();
const researchProjects = loadResearchProjects();

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ProjectContext.Provider value={{ computerProjects, researchProjects }}>
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
