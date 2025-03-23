import computerGif from '../assets/computer/ComputerGIF.gif';
import arrow from '../assets/computer/arrow.svg';
import EncircleButton from './ui/EncircleButton';

const Computer = () => {
  return (
    <main className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center">
          {/* selection section... */}
          <div className="relative mb-16">
            <div className="flex flex-col items-center">
              <p className="text-center mb-16 font-mono">pick your poison...</p>
              
              <div className="flex items-center justify-center w-full px-4 mt-4">
                {/* GitHub Button */}
                <div className="flex flex-col items-center mr-8">
                  <img 
                    src={arrow} 
                    alt="" 
                    className="w-[220px] -mb-10 -mr-10 transform rotate-0" 
                  />
                  <div className="text-center mt-10 -ml-40">
                    <EncircleButton 
                      to="https://github.com/francisco-the-man" 
                      external={true}
                      variant="content"
                    >
                      github
                    </EncircleButton>
                    <p className="text-sm mt-2 italic text-gray-600">(if u even care)</p>
                  </div>
                </div>
                
                {/* Center with Computer GIF */}
                <div className="mx-4 -mt-20">
                  <img 
                    src={computerGif} 
                    alt="Computer" 
                    className="w-64 h-auto"
                  />
                </div>
                
                {/* Right Side with Projects Button */}
                <div className="flex flex-col items-center ml-8">
                  <img 
                    src={arrow} 
                    alt="" 
                    className="w-[220px] -mb-100 -ml-10 transform scale-x-[-1]" 
                  />
                  <div className="text-center ml-40">
                    <EncircleButton 
                      to="/computer/projects"
                      variant="content"
                    >
                      projects
                    </EncircleButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Computer; 