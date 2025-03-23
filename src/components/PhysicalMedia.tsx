import { useState } from 'react';
import EncircleButton from './ui/EncircleButton';

// Import all artwork images with updated paths
import headless2025 from '../assets/creative/physical media/Headless2025.png';
import headlessSketch from '../assets/creative/physical media/Headless2025-sketch.png';
import portrait2025 from '../assets/creative/physical media/Portrait2025.png';
import connectiveDespair from '../assets/creative/physical media/ConnectiveDespair2025.png';
import swumdayCutout from '../assets/creative/physical media/SwumdayCutout2025.png';
import connectiveSketch1 from '../assets/creative/physical media/ConnectiveIssues-sketch1.png';
import connectiveSketch2 from '../assets/creative/physical media/ConnectiveIssues-sketch2.png';
import interlope from '../assets/creative/physical media/Interlope-sketch.png';
import trinityPrint1 from '../assets/creative/physical media/TrinityPrint-1-2024.png';
import trinityPrint2 from '../assets/creative/physical media/TrinityPrint-2-2024.png';
import trinityPrint3 from '../assets/creative/physical media/TrinityPrint-3-2024.png';
import intersticePrint from '../assets/creative/physical media/IntersticePrint-2024.png';
import ourOwnFunctionsPrint from '../assets/creative/physical media/OurOwnFunctionsPrint-2024.png';
import solarPrint from '../assets/creative/physical media/SolarPrint-2024.png';

// Define the artwork data
interface Artwork {
  id: number;
  image: string;
  title?: string;
  medium?: string;
  year?: string;
  size?: string; // size in grid
  group?: string; // identify which group this artwork belongs to
  isGroupTitle?: boolean; // whether this artwork has the title for its group
  marginTop?: string;
  marginLeft?: string;
  marginRight?: string;
  marginBottom?: string;
}

// Define artwork data with metadata and specific positioning to match reference
// Reorganized to group related works together
const artworks: Artwork[] = [
  // Interlope sketch (top left)
  {
    id: 1,
    image: interlope,
    size: "small",
  },
  
  // Headless set - Person on chair and sketch
  {
    id: 2,
    image: headless2025,
    title: "Headless (oil on laser-cut plywood)",
    year: "2025",
    size: "medium",
    group: "headless",
    marginLeft: "0.75rem",
  },
  {
    id: 3,
    image: headlessSketch,
    title: "Headless (crayon and pen)",
    year: "2025",
    size: "small",
    group: "headless",
    marginLeft: "0.5rem",
    marginTop: "1rem",
  },
  
  // Portrait and cutout
  {
    id: 4,
    image: portrait2025,
    title: "Self-portrait (oil)",
    year: "2025",
    size: "small",
    marginLeft: "1rem",
  },
  {
    id: 5,
    image: swumdayCutout,
    size: "small",
    marginTop: "0.5rem",
    marginLeft: "1.5rem",
  },
  
  // Large forest/tree painting (Connective Issue) with related sketches
  {
    id: 6,
    image: connectiveDespair,
    title: "Connective Issue (oil on canvas)",
    year: "2025",
    size: "large",
    group: "connective",
    isGroupTitle: true,
    marginLeft: "1rem",
  },
  {
    id: 7,
    image: connectiveSketch1,
    size: "medium",
    group: "connective",
    marginLeft: "0.5rem", 
    marginTop: "0.5rem",
  },
  {
    id: 8,
    image: connectiveSketch2,
    size: "small",
    group: "connective",
    marginLeft: "1rem",
    marginTop: "0.5rem",
  },
  
 
  
  // Trinity prints (grouped) - treated as a collection
  {
    id: 9,
    image: trinityPrint1,
    size: "small",
    group: "trinity",
  },
  {
    id: 10,
    image: trinityPrint2,
    size: "small",
    group: "trinity",
    marginLeft: "0.25rem",
  },
  {
    id: 11,
    image: trinityPrint3,
    title: "Break, Blow, Burn (monotype with graphite)",
    year: "2024",
    size: "small",
    group: "trinity",
    isGroupTitle: true,
    marginLeft: "0.25rem",
  },
  
  // Monotype with graphite group
   // Red print collection
   {
    id: 12,
    image: intersticePrint,
    size: "medium",
    group: "monotype",
  },
  {
    id: 13,
    image: ourOwnFunctionsPrint,
    size: "small",
    group: "monotype",
  },
  {
    id: 14,
    image: solarPrint,
    title: "Untitled monotype prints",
    year: "2024",
    size: "small",
    group: "monotype",
    isGroupTitle: true,
    marginTop: "0.5rem",
  }
];

const PhysicalMedia = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const openLightbox = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const closeLightbox = () => {
    setSelectedArtwork(null);
  };

  // Get style for each artwork based on its properties
  const getArtworkStyles = (artwork: Artwork) => {
    // Base style
    const style: React.CSSProperties = {
      marginTop: artwork.marginTop || '0',
      marginLeft: artwork.marginLeft || '0',
      marginRight: artwork.marginRight || '0',
      marginBottom: artwork.marginBottom || '0',
    };

    return style;
  };

  // Get appropriate classes for each artwork element
  const getArtworkClasses = (index: number, artwork: Artwork) => {
    let classes = "relative overflow-hidden cursor-pointer";
    
    // Special handling for specific artworks or groups
    if (artwork.image === connectiveDespair) {
      // Large painting of trees
      classes += " col-span-2 md:col-span-2 row-span-3 md:row-span-3";
    } 
    else if (artwork.image === headless2025) {
      // Person on chair
      classes += " col-span-2 md:col-span-2 row-span-2"; 
    }
    else if (artwork.group === "trinity") {
      // Trinity prints (grouped horizontally)
      classes += " col-span-1";
    }
    else if (artwork.group === "monotype") {
      // Monotype prints (stacked)
      classes += " col-span-1";
    }
    else if (artwork.image === intersticePrint) {
      // Red artwork
      classes += " col-span-1 md:col-span-1 row-span-2";
    }
    else if (artwork.image === connectiveSketch1) {
      // Connective sketch 1
      classes += " col-span-1 md:col-span-1";
    }
    else {
      // Default sizing based on the size property
      switch(artwork.size) {
        case 'large':
          classes += " col-span-2 row-span-2";
          break;
        case 'medium':
          classes += " col-span-1 md:col-span-1 row-span-1";
          break;
        case 'small':
        default:
          classes += " col-span-1";
          break;
      }
    }
    
    return classes;
  };

  // Group artworks by collection for rendering
  const shouldShowTitle = (artwork: Artwork) => {
    // Only show title if it's the group title holder or doesn't belong to a group
    return !artwork.group || artwork.isGroupTitle;
  };

  return (
    <main className="py-6 px-6 md:px-12 flex flex-col min-h-screen bg-white">
      <div className="container mx-auto max-w-[1400px] flex-grow">
        <div className="flex flex-col">
          {/* Page Title and Back Button */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl">Physical Media</h1>
            <div className="flex space-x-4">
              <EncircleButton 
                to="/creative"
                variant="nav"
              >
                back
              </EncircleButton>
            </div>
          </div>
          
          {/* Salon-style Gallery with custom layout */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-1 md:gap-2 auto-rows-auto mb-16">
            {artworks.map((artwork, index) => (
              <div 
                key={artwork.id} 
                className={getArtworkClasses(index, artwork)}
                style={getArtworkStyles(artwork)}
                onClick={() => openLightbox(artwork)}
              >
                <img 
                  src={artwork.image} 
                  alt={artwork.title || `Artwork ${artwork.id}`} 
                  className="w-full h-auto object-contain bg-white"
                />
                
                {/* Only show caption for artworks with title/year and appropriate group titles */}
                {artwork.title && shouldShowTitle(artwork) && (
                  <div className="text-[8px] md:text-xs pt-1 pb-2">
                    <p>{artwork.title} {artwork.year && artwork.year}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox for viewing larger images */}
      {selectedArtwork && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-5xl max-h-[90vh] overflow-auto bg-transparent"
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={selectedArtwork.image} 
              alt={selectedArtwork.title || `Artwork ${selectedArtwork.id}`} 
              className="max-h-[80vh] w-auto"
            />
            {selectedArtwork.title && (
              <div className="bg-white bg-opacity-90 p-4 absolute bottom-0 left-0 right-0">
                <p className="text-lg font-medium">{selectedArtwork.title}</p>
                {selectedArtwork.year && <p className="text-sm">{selectedArtwork.year}</p>}
              </div>
            )}
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
              onClick={closeLightbox}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default PhysicalMedia; 