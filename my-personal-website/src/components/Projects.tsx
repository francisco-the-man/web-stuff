import { useState } from 'react';
import EncircleButton from './ui/EncircleButton';
import ProjectFolder from './ui/ProjectFolder';
import { Link } from 'react-router-dom';
import { useProjects, ProjectData } from '../context/ProjectContext';

const Projects = () => {
  // Get projects from context
  const { projects } = useProjects();
  
  // Filter projects to only show computer projects or both
  const filteredProjects = projects.filter(
    project => project.category === 'computer' || project.category === 'both'
  );
  
  const [activeIndex, setActiveIndex] = useState(0);

  // Navigate through projects
  const showNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % filteredProjects.length);
  };

  const showPrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + filteredProjects.length) % filteredProjects.length);
  };

  return (
    <main className="py-6 px-4 flex flex-col min-h-screen">
      <div className="container mx-auto max-w-4xl flex-grow">
        <div className="flex flex-col">
          {/* Page Title and Back Button */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl">Projects</h1>
            <div className="flex space-x-4">
              
              <EncircleButton 
                to="/computer"
                variant="nav"
              >
                back
              </EncircleButton>
            </div>
          </div>
          
          {/* Projects Stacked Display */}
          <div className="relative h-[200px] flex items-center justify-center mb-8">
            {/* Navigation buttons */}
            <div className="absolute top-[150%] left-0 transform -translate-y-1/2 z-30">
              <button 
                onClick={showPrevious}
                className="bg-white border border-black p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Previous project"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="absolute top-[150%] right-0 transform -translate-y-1/2 z-30">
              <button 
                onClick={showNext}
                className="bg-white border border-black p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Next project"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Stacked projects */}
            <div className="relative w-full max-w-xl mx-auto">
              {filteredProjects.map((project, index) => {
                // Calculate the display index relative to active (for stacking)
                const relativeIndex = (index - activeIndex + filteredProjects.length) % filteredProjects.length;
                
                // Only render visible items (first 3 in stack plus current item if it's further back)
                if (relativeIndex > 2 && relativeIndex !== filteredProjects.length - 1) return null;
                
                // Scale factors for different positions
                let zIndex = 20 - relativeIndex;
                let offsetY = 0;
                let scale = 1;
                let opacity = 1;
                
                if (relativeIndex === 0) {
                  // Current item - fully visible at front
                  zIndex = 20;
                  offsetY = 0;
                  scale = 1;
                  opacity = 1;
                } else if (relativeIndex === 1) {
                  // First item behind
                  zIndex = 19;
                  offsetY = -25;
                  scale = 0.95;
                  opacity = 0.9;
                } else if (relativeIndex === 2) {
                  // Second item behind
                  zIndex = 18;
                  offsetY = -45;
                  scale = 0.9;
                  opacity = 0.8;
                } else {
                  // All items further back (only show if it's the last one)
                  zIndex = 17;
                  offsetY = -60;
                  scale = 0.85;
                  opacity = 0.7;
                }
                
                return (
                  <div 
                    key={project.id}
                    className="absolute left-0 right-0 transition-all duration-500 ease-in-out cursor-pointer"
                    style={{
                      zIndex,
                      transform: `translateY(${offsetY}px) scale(${scale})`,
                      opacity,
                    }}
                    onClick={() => relativeIndex !== 0 && setActiveIndex(index)}
                  >
                    <ProjectFolder
                      fileName={project.fileName}
                      projectTitle={project.projectTitle}
                      projectImg={project.projectImg}
                      description={project.description}
                      type={project.type}
                      position={project.position}
                      authorNames={project.authorNames}
                      repoLink={project.repoLink}
                      className="mx-auto shadow-lg"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Project navigation dots */}
          <div className="flex justify-center mb-4">
            {filteredProjects.map((project, index) => (
              <button
                key={project.id}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 mx-1 rounded-full transition-all ${
                  index === activeIndex ? 'bg-black scale-125' : 'bg-gray-300'
                }`}
                aria-label={`Show project ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Project counter - moved to the bottom */}
      <div className="container mx-auto max-w-4xl mt-auto">
        <div className="text-center py-6 font-mono border-t border-gray-200 mt-8">
          <span className="text-lg">{activeIndex + 1}</span>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-400">{filteredProjects.length}</span>
        </div>
      </div>
    </main>
  );
};

export default Projects; 