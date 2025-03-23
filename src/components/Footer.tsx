import { useChaos } from '../context/ChaosContext';
import EncircleButton from './ui/EncircleButton';

const Footer = () => {
  const { chaosMode, setChaosMode } = useChaos();

  return (
    <footer className="bg-white text-black p-6 mt-auto border-t border-black relative z-50">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        {/* Left side buttons */}
        <div className="flex space-x-6 mb-4 sm:mb-0">
          <EncircleButton 
            onClick={() => setChaosMode(false)} 
            isActive={!chaosMode}
          >
            Order
          </EncircleButton>
          
          <EncircleButton 
            onClick={() => setChaosMode(true)} 
            spiky={true}
            isActive={chaosMode}
          >
            Chaos
          </EncircleButton>
        </div>
        
        {/* Right side button */}
        <div>
          <EncircleButton to="/contact">
            Contact Me
          </EncircleButton>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 