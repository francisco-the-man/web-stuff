import profileImage from '../assets/avery_profile.png';
import symsysPopup from '../assets/symsys-popup.svg';

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
                src={profileImage} 
                alt="Avery" 
                className="w-full"
              />
            </div>
            
            <div className="flex flex-col md:max-w-md">
              <h1 className="text-xl font-medium mb-4">Hi, I'm Avery</h1>
              
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
          
          {/* Bio paragraphs */}
          <div className="prose max-w-none text-justify mt-8">
            <p className="mb-6">
              If I had to put it concisely, I'd say I'm most interested in how we come to 
              <span className="italic"> know </span> 
              things about the world, how that knowledge is both interconnected and interdependent, 
              and the ways in which we mislead ourselves.
            </p>

            <p className="mb-6">
              I like to play around with <span className="italic">formal systems</span>, <span className="italic">computational models</span>,
              and <span className="italic">digital art</span>. But I also like to use my hands and build things in the real world (prints, paintings,
              sculptures and physical devices (gizmos!)). 
            </p>

            <p className="mb-6">
              Right now, I'm thinking about how we can use <span className="italic">computational models</span> to 
              understand how science gets a hold on reality, I'm working on a video game about Tycho Brahe, and
              I'm trying to build a graph-based information extraction system for journalism.
            </p>
            
            
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home; 
