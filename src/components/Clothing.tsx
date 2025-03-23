import { useState } from 'react';
import EncircleButton from './ui/EncircleButton';

// Import all sketch images
import sketch1 from '../assets/creative/clothing/sketches/Runway-2024-1.png';
import sketch2 from '../assets/creative/clothing/sketches/Runway-2024-2.png';
import sketch3 from '../assets/creative/clothing/sketches/Runway-2024-PREPDESIGN3.png';
import sketch4 from '../assets/creative/clothing/sketches/Runway-2024-PREPDesign4.png';
import sketch5 from '../assets/creative/clothing/sketches/Military-pants.png';
import sketch6 from '../assets/creative/clothing/sketches/Shibori-jacket.png';
import sketch7 from '../assets/creative/clothing/sketches/Dyed-trou-black-vest.png';
import sketch8 from '../assets/creative/clothing/sketches/Halloween-costume.png';
import sketch9 from '../assets/creative/clothing/sketches/Red-trou.png';
import sketch10 from '../assets/creative/clothing/sketches/Runway-2025-1.png';
import sketch11 from '../assets/creative/clothing/sketches/Runway-2025-2.png';
import sketch12 from '../assets/creative/clothing/sketches/Runway-2024-prep.png';

// Import detail images
import runway2024_2_detail1 from '../assets/creative/clothing/details/Runway-2024-2-detail1.png';
import runway2024_2_detail2 from '../assets/creative/clothing/details/Runway-2024-2-detail2.png';
import runway2025_1_detail1 from '../assets/creative/clothing/details/Runway-2025-1-detail1.png';
import runway2025_1_detail2 from '../assets/creative/clothing/details/Runway-2025-1-detail2.png';
import runway2025_2_detail1 from '../assets/creative/clothing/details/Runway-2025-2-detail1.png';
import runway2025_2_detail2 from '../assets/creative/clothing/details/Runway-2025-2-detail2.png';

// Define the clothing sketches data
interface ClothingSketch {
  id: number;
  title: string;
  image: string;
  detailImages?: string[];
  description: string;
  hasHover: boolean;
  isRunway: boolean;
}

// First define runway designs (the ones with hover effects)
// Reordered to show 2025 designs first, then 2024
const runwaySketches: ClothingSketch[] = [
  {
    id: 10,
    title: 'Runway 2025 Design 1',
    image: sketch10,
    detailImages: [runway2025_1_detail1, runway2025_1_detail2],
    description: 'French Toile fabric reimagined as streetwear.',
    hasHover: true,
    isRunway: true
  },
  {
    id: 11,
    title: 'Runway 2025 Design 2',
    image: sketch11,
    detailImages: [runway2025_2_detail1, runway2025_2_detail2],
    description: 'Moiré silk geo pants, with a button-covered top.',
    hasHover: true,
    isRunway: true
  },
  {
    id: 1,
    title: 'Runway 2024 Design 1',
    image: sketch1,
    description: 'Striped silk corset top with silver printed harem pants.',
    hasHover: true,
    isRunway: true
  },
  {
    id: 2,
    title: 'Runway 2024 Design 2',
    image: sketch2,
    detailImages: [runway2024_2_detail1, runway2024_2_detail2],
    description: 'Indigo denim jacket and pants set with ticking details.',
    hasHover: true,
    isRunway: true
  }
];

// Then define other sketches (no hover effects)
const otherSketches: ClothingSketch[] = [
  {
    id: 3,
    title: 'Runway 2024 Prep Design 3',
    image: sketch3,
    description: 'Sleek dark ensemble with asymmetrical elements and minimalist styling.',
    hasHover: false,
    isRunway: false
  },
  {
    id: 4,
    title: 'Runway 2024 Prep Design 4',
    image: sketch4,
    description: 'Layered design with vest, metallic accessories and structured pants.',
    hasHover: false,
    isRunway: false
  },
  {
    id: 5,
    title: 'Military Pants',
    image: sketch5,
    description: 'Utility-inspired design with black vest and functional cargo pants.',
    hasHover: false,
    isRunway: false
  },
  {
    id: 6,
    title: 'Shibori Jacket',
    image: sketch6,
    description: 'Asymmetrical design with red colorblocking and modern silhouette.',
    hasHover: false,
    isRunway: false
  },
  {
    id: 7,
    title: 'Dyed Trouser with Black Vest',
    image: sketch7,
    description: 'Contrast ensemble with fitted black vest and vibrant patterned pants.',
    hasHover: false,
    isRunway: false
  },
  {
    id: 8,
    title: 'Halloween Costume',
    image: sketch8,
    description: 'Dramatic red costume with elaborate headpiece and extended arms.',
    hasHover: false,
    isRunway: false
  },
  {
    id: 9,
    title: 'Red Trousers',
    image: sketch9,
    description: 'Casual look with white top and relaxed-fit red pants with tie-dye effect.',
    hasHover: false,
    isRunway: false
  },
  {
    id: 12,
    title: 'Runway 2024 Prep Design',
    image: sketch12,
    description: 'Layered design with vest, metallic accessories and structured pants.',
    hasHover: false,
    isRunway: false
  }
];

const Clothing = () => {
  const [selectedSketch, setSelectedSketch] = useState<ClothingSketch | null>(null);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);

  const openDetailView = (sketch: ClothingSketch) => {
    if (sketch.hasHover) {
      setSelectedSketch(sketch);
      setCurrentDetailIndex(0); // Reset to the first detail image
    }
  };

  const closeDetailView = () => {
    setSelectedSketch(null);
  };

  const nextDetailImage = () => {
    if (selectedSketch?.detailImages) {
      setCurrentDetailIndex((prevIndex) => 
        (prevIndex + 1) % selectedSketch.detailImages!.length
      );
    }
  };

  const prevDetailImage = () => {
    if (selectedSketch?.detailImages) {
      setCurrentDetailIndex((prevIndex) => 
        (prevIndex - 1 + selectedSketch.detailImages!.length) % selectedSketch.detailImages!.length
      );
    }
  };

  // Function to render a sketch item
  const renderSketchItem = (sketch: ClothingSketch) => (
    <div 
      key={sketch.id} 
      className={`relative overflow-hidden ${sketch.hasHover ? 'cursor-pointer' : ''}`}
      onClick={() => sketch.hasHover ? openDetailView(sketch) : null}
    >
      <div className="aspect-[3/4] overflow-hidden flex items-center justify-center">
        <img 
          src={sketch.image} 
          alt={sketch.title} 
          className="max-h-[400px] w-auto object-contain"
        />
        
        {/* Only add hover overlay for runway designs */}
        {sketch.hasHover && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-70 transition-opacity duration-300 flex items-center justify-center">
            <div className="p-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-lg font-semibold mb-2">{sketch.title}</h3>
              <p className="text-sm">{sketch.description}</p>
              {sketch.detailImages && sketch.detailImages.length > 0 ? (
                <p className="text-xs mt-2 italic">Click to see images of completed look</p>
              ) : (
                <p className="text-xs mt-2 italic">Click to see details</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Only show title for runway designs */}
      {sketch.hasHover && (
        <div className="py-3">
          <h3 className="text-sm font-medium truncate">{sketch.title}</h3>
        </div>
      )}
    </div>
  );

  // Function to render runway section with consistent sizing
  const renderRunwaySection = () => (
    <div className="mb-12">
      <h2 className="text-lg font-semibold mb-6">Runway Collections (hover for more):</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {runwaySketches.map(renderSketchItem)}
      </div>
    </div>
  );

  // Function to render other designs section with consistent sizing
  const renderOtherDesignsSection = () => (
    <div className="mb-12">
      <h2 className="text-lg font-semibold mb-6">Other Designs:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {otherSketches.map(renderSketchItem)}
      </div>
    </div>
  );

  return (
    <main className="py-6 px-8 md:px-16 flex flex-col min-h-screen">
      <div className="container mx-auto max-w-[1200px] flex-grow">
        <div className="flex flex-col">
          {/* Page Title and Back Button */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl">Clothes I have made/want to make</h1>
            <div className="flex space-x-4">
              <EncircleButton 
                to="/creative"
                variant="nav"
              >
                back
              </EncircleButton>
            </div>
          </div>
          
          {/* Introduction */}
          <div className="mb-8">
            <p className="mb-4">
              I am working on digitising the patterns I've made for some of these
              so if you want patterns, <EncircleButton to="/contact" variant="nav">contact me</EncircleButton> & if I have a file I'll send it over.
            </p>
          </div>
          
          {/* Render the sections */}
          {renderRunwaySection()}
          {renderOtherDesignsSection()}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSketch && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={closeDetailView}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedSketch.title}</h2>
                <button 
                  onClick={closeDetailView}
                  className="text-gray-600 hover:text-black"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Detail Images in collage style */}
              <div className="mb-4">
                {selectedSketch.detailImages && selectedSketch.detailImages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original sketch image */}
                    <div>
                      <img 
                        src={selectedSketch.image} 
                        alt={`${selectedSketch.title} sketch`} 
                        className="w-full h-auto"
                      />
                    </div>

                    {/* Detail images */}
                    {selectedSketch.detailImages.map((image, index) => (
                      <div key={index}>
                        <img 
                          src={image} 
                          alt={`${selectedSketch.title} detail ${index + 1}`} 
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <img 
                      src={selectedSketch.image} 
                      alt={selectedSketch.title} 
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-700">{selectedSketch.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Clothing; 