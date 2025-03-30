import { useState } from 'react';
import EncircleButton from './ui/EncircleButton';

// Define the video data structure
interface Video {
  id: number;
  vimeoId: string;
  title: string;
  year?: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
}

// Sample video collection - replace with your actual videos
const videos: Video[] = [
  {
    id: 1,
    vimeoId: "653619270",
    title: "The Anti-Babel",
    year: "2021",
    description: "A meditation on mysticism and its relationship to language. Inspired by Michael DeCerteau.",
    size: 'large',
  },
  {
    id: 2,
    vimeoId: "1070722976", // vimeo ID number
    title: "Taurobolium",
    year: "2023",
    description: "Journalism at the end of the world... (lost the captions on this one... getting them back soon)",
    size: 'medium',
  },
  {
    id: 3,
    vimeoId: "1070723572",
    title: "Broken Symmetry",
    year: "2023",
    description: "",
    size: 'medium',
  },
  {
    id: 4,
    vimeoId: "1070724253",
    title: "Broken Symmetry (excerpt)",
    year: "2023",
    description: "",
    size: 'small',
  },
];

const VideoArt = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const openLightbox = (video: Video) => {
    setSelectedVideo(video);
  };

  const closeLightbox = () => {
    setSelectedVideo(null);
  };

  // Get appropriate classes for each video element
  const getVideoClasses = (video: Video) => {
    let classes = "relative overflow-hidden cursor-pointer";
    
    switch(video.size) {
      case 'large':
        classes += " col-span-2 md:col-span-4 row-span-2";
        break;
      case 'medium':
        classes += " col-span-2 md:col-span-2 row-span-1";
        break;
      case 'small':
      default:
        classes += " col-span-1 md:col-span-2";
        break;
    }
    
    return classes;
  };

  // Video thumbnail component
  const VideoThumbnail = ({ video }: { video: Video }) => (
    <div className={getVideoClasses(video)} onClick={() => openLightbox(video)}>
      <div style={{padding: '56.25% 0 0 0', position: 'relative'}}>
        <iframe 
          src={`https://player.vimeo.com/video/${video.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&background=1`}
          frameBorder="0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%'}} 
        />
      </div>
      <div className="text-xs md:text-sm pt-1 pb-2">
        <p>{video.title} {video.year && `(${video.year})`}</p>
        {video.description && <p className="text-gray-600 text-[8px] md:text-xs">{video.description}</p>}
      </div>
    </div>
  );

  return (
    <main className="py-6 px-6 md:px-12 flex flex-col min-h-screen bg-white">
      <div className="container mx-auto max-w-[1400px] flex-grow">
        <div className="flex flex-col">
          {/* Page Title and Back Button */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl">Video Art</h1>
            <div className="flex space-x-4">
              <EncircleButton 
                to="/creative"
                variant="nav"
              >
                back
              </EncircleButton>
            </div>
          </div>
          
          {/* Video Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-8 gap-4 md:gap-6 auto-rows-auto mb-16">
            {videos.map((video) => (
              <VideoThumbnail key={video.id} video={video} />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox for viewing selected video */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] overflow-auto bg-transparent"
            onClick={e => e.stopPropagation()}
          >
            <div style={{padding: '56.25% 0 0 0', position: 'relative'}}>
              <iframe 
                src={`https://player.vimeo.com/video/${selectedVideo.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1`}
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
                style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%'}} 
              />
            </div>
            <div className="bg-white bg-opacity-90 p-4 absolute bottom-0 left-0 right-0">
              <p className="text-lg font-medium">{selectedVideo.title}</p>
              {selectedVideo.year && <p className="text-sm">{selectedVideo.year}</p>}
              {selectedVideo.description && <p className="text-sm mt-1">{selectedVideo.description}</p>}
            </div>
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

export default VideoArt; 