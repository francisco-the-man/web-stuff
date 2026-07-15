import symsysPopup from '../assets/symsys-popup.svg';
import Markdown from './ui/Markdown';
import homeContent from '../_content/home.json';

const Home = () => {
  return (
    <main className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col mb-8">
          {/* Header with name and image - image on left */}
          <div className="flex flex-col md:flex-row items-start mb-8">
            {/* Image moved back to left, border and rounded corners removed */}
            <div className="md:mr-12 mb-8 md:mb-0 md:max-w-[200px]">
              <img
                src={homeContent.profileImage}
                alt="Avery Louis"
                className="w-full"
              />
            </div>
            
            <div className="flex flex-col md:max-w-md">
              <h1 className="text-xl font-medium mb-4">{homeContent.heading}</h1>
              
              {/* Symbolic Systems with popup on hover */}
              <div className="relative">
                <p className="text-xl">
                  I'm studying{" "}
                  {/* Using group on just the underlined text so hover only works on that element */}
                  <span className="group relative inline-block">
                    <a href="#" className="underline hover:text-gray-600">
                      symbolic systems
                    </a>
                    
                    
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-96 bottom-5 -right-60 z-20">
                      <div className="relative">
                        <img 
                          src={symsysPopup} 
                          alt="" 
                          className="w-full h-auto object-contain"
                          style={{ 
                            transform: 'scaleY(0.8)',
                            pointerEvents: 'none'
                          }}
                        />
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-[#3982F7] text-xs leading-tight px-16 -mt-2">
                            <span className="font-bold">something like this:</span><br />
                            consciousness as understood through<br />
                            computer science, philosophy, and<br />
                            neuroscience
                          </p>
                        </div>
                      </div>
                    </div>
                  </span>
                  {" "}at Stanford
                </p>
              </div>
            </div>
          </div>
          
          {/* Bio paragraphs (edited via /admin) */}
          <Markdown
            className="prose max-w-none text-justify mt-8"
            paragraphClassName="mb-6"
          >
            {homeContent.bio}
          </Markdown>
        </div>
      </div>
    </main>
  );
};

export default Home; 
