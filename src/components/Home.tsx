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
              I think human beings are rich and fascinating, but I also think we, and our creations 
              (formal systems included), are fallible. I think we exist at the limit. Our capacity 
              for dialogue is unique— it shapes our societies, drives our technology, and pushes us 
              toward a <span className="italic">collective sense of understanding</span>. But this 
              intersubjectivity is also exactly why we're stuck somewhere between subjectivity and 
              objectivity. On one hand, we live deeply within our individual perceptions, limited 
              by our senses and embodied experiences. On the other, language lets us transcend those 
              personal boundaries, offering us an imperfect glimpse of what lies beyond our immediate 
              reach. This collective vision—this shared yet always slightly-out-of-reach understanding—is 
              what I want to try to understand.
            </p>
            
            <p className="mb-12">
              As for methodology, I am with Michel Serres when he says "cross-breeding is my cultural ideal"- 
              in other words, I think interdisciplinarity is essential.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home; 