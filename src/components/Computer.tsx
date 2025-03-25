import computerGif from '../assets/computer/ComputerGIF.gif';
import arrow from '../assets/computer/arrow.svg';
import EncircleButton from './ui/EncircleButton';

const Computer = () => {
  return (
    <main className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center">
          {/* selection section... */}
          <div className="relative mb-16 w-full">
            <div className="flex flex-col items-center">
              <p className="text-center mb-8 md:mb-16 font-mono">pick your poison...</p>
              
              {/* Use transform and scale-based responsive design instead of flex-based layout */}
              <div className="relative w-full max-w-md mx-auto">
                {/* Center with Computer GIF - Positioned absolutely as the reference point */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 w-40 md:w-64 z-10">
                  <img 
                    src={computerGif} 
                    alt="Computer" 
                    className="w-full h-auto"
                  />
                </div>
                
                {/* GitHub Button - Left side */}
                <div className="absolute left-0 top-20 md:top-24 transform scale-75 md:scale-100 origin-left z-0">
                  <div className="relative">
                    <img 
                      src={arrow} 
                      alt="" 
                      className="w-[180px] md:w-[220px] transform rotate-0" 
                    />
                    <div className="absolute left-0 -bottom-10 transform -translate-x-1/4 translate-y-1/2">
                      <EncircleButton 
                        to="https://github.com/francisco-the-man" 
                        external={true}
                        variant="nav"
                      >
                        github
                      </EncircleButton>
                      <p className="text-xs md:text-sm mt-2 italic text-gray-600">(if u even care)</p>
                    </div>
                  </div>
                </div>
                
                {/* Projects Button - Right side */}
                <div className="absolute right-0 top-20 md:top-24 transform scale-75 md:scale-100 origin-right z-0">
                  <div className="relative">
                    <img 
                      src={arrow} 
                      alt="" 
                      className="w-[180px] md:w-[220px] transform scale-x-[-1]" 
                    />
                    <div className="absolute right-0 -bottom-10 transform translate-x-1/4 translate-y-1/2">
                      <EncircleButton 
                        to="/computer/projects"
                        variant="nav"
                      >
                        projects
                      </EncircleButton>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Add extra space at bottom to account for absolute positioning */}
              <div className="h-32 md:h-40"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Computer; 