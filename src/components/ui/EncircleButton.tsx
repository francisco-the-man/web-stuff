import { Link } from 'react-router-dom';
import encircleSvg from '../../assets/encircle.svg';
import encircleSpikysvg from '../../assets/encircle-spiky.svg';
import { CSSProperties } from 'react';

type ButtonVariant = 'nav' | 'content';

interface EncircleButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  external?: boolean;
  spiky?: boolean;
  className?: string;
  isActive?: boolean;
  variant?: ButtonVariant;
}

const EncircleButton = ({ 
  children, 
  to, 
  onClick, 
  external = false, 
  spiky = false, 
  className = '',
  isActive = false,
  variant = 'nav'
}: EncircleButtonProps) => {
  // Get styling based on variant and content
  const getEncircleStyle = (): CSSProperties => {
    const textLength = typeof children === 'string' ? children.toString().length : 0;
    
    // Navigation/footer variant (compact)
    if (variant === 'nav') {
      return {
        pointerEvents: 'none' as const,
        top: '-25%',
        left: '-5%',
        width: '130%',
        height: '150%',
        transform: `scaleX(${typeof children === 'string' ? Math.min(children.length * 0.1 + 1, 1.6) : 1.2}) scaleY(1.2)`
      };
    }
    
    // Content variant (larger, dynamic sizing based on text length)
    return {
      pointerEvents: 'none' as const,
      top: '-25%',
      left: '-40%',
      width: '150%',
      height: '150%',
      transform: `scaleX(${typeof children === 'string' ? children.length * 0.25 + 1.2 : 2}) scaleY(1.6)`
    };
  };
  
  const ButtonContent = () => (
    <>
      <div className={`relative z-10 transition-colors duration-200 ${isActive ? 'font-bold' : ''} ${className}`}>
        {children}
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <img 
          src={spiky ? encircleSpikysvg : encircleSvg} 
          alt="" 
          className="absolute w-full h-auto object-contain transform"
          style={getEncircleStyle()}
        />
      </div>
    </>
  );

  // External link case
  if (to && external) {
    return (
      <div className="relative group inline-block px-2 py-1">
        <a 
          href={to} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="relative z-10 transition-colors duration-200"
        >
          <ButtonContent />
        </a>
      </div>
    );
  }

  // Internal link case
  if (to) {
    return (
      <div className="relative group inline-block px-2 py-1">
        <Link to={to} className="relative z-10 transition-colors duration-200">
          <ButtonContent />
        </Link>
      </div>
    );
  }

  // Button case
  return (
    <div className="relative group inline-block px-2 py-1">
      <button 
        onClick={onClick}
        className="relative z-10 transition-colors duration-200"
      >
        <ButtonContent />
      </button>
    </div>
  );
};

export default EncircleButton; 