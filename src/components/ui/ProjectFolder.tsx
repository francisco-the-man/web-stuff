import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EncircleButton from './EncircleButton';
import { CSSProperties } from 'react';
// Import SVG assets
import folderLSvg from '../../assets/projects/FolderL.svg';
import folderMSvg from '../../assets/projects/FolderM.svg';
import folderRSvg from '../../assets/projects/FolderR.svg';

// GitHub logo SVG
const GitHubLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.489C9.34 21.579 9.52 21.273 9.52 21.012C9.52 20.775 9.512 20.136 9.508 19.3C6.726 19.91 6.14 17.861 6.14 17.861C5.684 16.726 5.029 16.421 5.029 16.421C4.121 15.765 5.098 15.777 5.098 15.777C6.101 15.849 6.63 16.844 6.63 16.844C7.521 18.327 8.97 17.908 9.54 17.657C9.628 17.05 9.883 16.632 10.16 16.419C7.93 16.202 5.582 15.353 5.582 11.613C5.582 10.52 6.002 9.628 6.65 8.933C6.55 8.684 6.178 7.658 6.75 6.337C6.75 6.337 7.587 6.073 9.496 7.431C10.295 7.211 11.152 7.102 12 7.098C12.848 7.102 13.705 7.211 14.504 7.431C16.413 6.073 17.25 6.337 17.25 6.337C17.822 7.658 17.45 8.684 17.35 8.933C17.998 9.628 18.418 10.52 18.418 11.613C18.418 15.363 16.068 16.2 13.836 16.413C14.185 16.685 14.512 17.227 14.512 18.043C14.512 19.207 14.499 20.684 14.499 21.012C14.499 21.275 14.677 21.584 15.186 21.487C19.158 20.16 22 16.416 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor"/>
  </svg>
);

// Placeholder image component
const ImagePlaceholder = ({ title, error }: { title: string, error?: string }) => (
  <div className="w-full h-36 bg-gray-100 border border-gray-300 flex flex-col items-center justify-center p-2">
    <p className="text-gray-500 text-sm text-center">{title}</p>
    {error && (
      <p className="text-red-500 text-xs mt-1 text-center">
        {error.length > 60 ? error.substring(0, 60) + '...' : error}
      </p>
    )}
  </div>
);

// Types for the component
type ProjectType = 'written' | 'computational';
type FolderPosition = 'left' | 'middle' | 'right';

interface ProjectFolderProps {
  fileName: string;
  projectTitle: string;
  projectImg: string;
  description: string;
  type: ProjectType;
  position?: FolderPosition;
  authorNames?: string; // Required for 'written' type
  repoLink?: string; // Required for 'computational' type
  className?: string;
}

const ProjectFolder: React.FC<ProjectFolderProps> = ({
  fileName,
  projectTitle,
  projectImg,
  description,
  type,
  position = 'left',
  authorNames,
  repoLink,
  className = '',
}) => {
  const [imageError, setImageError] = useState<string | null>(null);
  
  // Log the incoming image URL for debugging
  useEffect(() => {
    console.log(`ProjectFolder ${fileName} received image URL:`, projectImg);
  }, [fileName, projectImg]);
  
  // Check if the image URL is valid and return a potentially modified URL
  const getImageUrl = (url: string): string => {
    if (!url || url === "" || url.includes("undefined") || url.includes("null")) {
      // Invalid URL, don't attempt to process it
      console.warn(`ProjectFolder ${fileName}: Invalid image URL`, url);
      return "";
    }
    
    // Fix malformed URLs with a double protocol (caused by leading slash issue)
    if (url.startsWith('/http')) {
      const fixedUrl = url.substring(1);
      console.log(`ProjectFolder ${fileName}: Fixing URL by removing leading slash: ${fixedUrl}`);
      return fixedUrl;
    }
    
    // If it's a relative URL, make it absolute
    if (url.startsWith('/')) {
      const absoluteUrl = `${window.location.origin}${url}`;
      console.log(`ProjectFolder ${fileName}: Converting relative URL to absolute:`, absoluteUrl);
      return absoluteUrl;
    }
    
    // Handle GitHub URLs specifically
    if (url.includes('github.com') || url.includes('github.io') || url.includes('githubusercontent.com')) {
      console.log(`ProjectFolder ${fileName}: Detected GitHub URL:`, url);
      
      // Convert github.com/user/repo/blob/main/image.jpg to raw content URL if needed
      if (url.includes('github.com') && url.includes('/blob/')) {
        // Convert from regular GitHub URL to raw URL
        const rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        console.log(`ProjectFolder ${fileName}: Converting GitHub URL to raw URL:`, rawUrl);
        return rawUrl;
      }
      
      // Add CORS proxy for GitHub URLs if needed
      // (commented out as this is optional and depends on if you face CORS issues)
      /*
      if (url.includes('github.io') || url.includes('githubusercontent.com')) {
        const corsProxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
        console.log(`Adding CORS proxy to GitHub URL: ${corsProxyUrl}`);
        return corsProxyUrl;
      }
      */
      
      // For now, just use the URL directly
      return url;
    }
    
    console.log(`ProjectFolder ${fileName}: Using original URL:`, url);
    return url;
  };

  // Get folder SVG based on position
  const getFolderSvg = () => {
    try {
      switch (position) {
        case 'left':
          return folderLSvg;
        case 'middle':
          return folderMSvg;
        case 'right':
          return folderRSvg;
        default:
          return folderLSvg;
      }
    } catch (error) {
      console.error('Error loading folder SVG:', error);
      return ''; // Return empty string as fallback
    }
  };

  // Style for positioning the fileName in the tab
  const getFileNameStyle = (): CSSProperties => {
    if (position === 'left') {
      return {
        position: 'absolute',
        top: '2%', // Percentage based for better scaling
        left: '18%',
        transform: 'translateX(-50%)',
        zIndex: 10
      };
    } else if (position === 'middle') {
      return {
        position: 'absolute',
        top: '2%', // Percentage based for better scaling
        left: '38%',
        transform: 'translateX(0%)',
        zIndex: 10
      };
    } else { // right position
      return {
        position: 'absolute',
        top: '2%', // Percentage based for better scaling
        right: '18%',
        transform: 'translateX(50%)',
        zIndex: 10
      };
    }
  };

  // Handle image error with more details
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    setImageError(`Failed to load image: ${target.src.substring(0, 30)}...`);
    console.error('Image failed to load:', target.src);
  };

  const processedImageUrl = getImageUrl(projectImg);

  return (
    <div className={`absolute top-[20%] w-full max-w-xl mx-auto ${className}`}>
      {/* Folder graphic with content positioned on top */}
      <div className="relative">
        {/* SVG Folder */}
        <div className="w-full">
          <img src={getFolderSvg()} alt="Folder" className="w-full h-auto" />
        </div>
        
        {/* File name in tab */}
        <div 
          style={getFileNameStyle()}
          className="text-base px-12"
        >
          {fileName}
        </div>
        
        {/* Content inside folder */}
        <div className="absolute top-[15%] left-0 right-0 bottom-[15%] flex flex-col items-center px-12">
          {/* Project title */}
          <h3 className="text-2xl font-bold uppercase mb-4 text-center">{projectTitle}</h3>
          
          {/* Project image with improved fallback */}
          <div className="w-4/5 mb-4">
            {imageError || !processedImageUrl ? (
              <ImagePlaceholder 
                title={imageError ? "Image failed to load" : "No image available"} 
                error={imageError || undefined}
              />
            ) : (
              <img 
                src={processedImageUrl} 
                alt={projectTitle} 
                className="w-full h-36 object-cover border border-gray-200"
                onError={handleImageError}
                loading="lazy" // Add lazy loading for better performance
              />
            )}
          </div>
          
          {/* Description - using a specific height and line-clamp-4 */}
          <p className="text-sm mb-3 text-center line-clamp-4" style={{ minHeight: '4.8rem' }}>
            {description}
          </p>
          
          {/* Author or GitHub link */}
          <div className="mt-auto">
            {type === 'written' ? (
              <p className="text-xs italic">
                written by: {authorNames}
              </p>
            ) : (
              <div className="flex items-center justify-center">
                <span className="mr-2 text-gray-700">
                  <GitHubLogo />
                </span>
                <EncircleButton 
                  to={repoLink || '#'} 
                  external={true}
                  variant="nav"
                >
                  code
                </EncircleButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFolder; 