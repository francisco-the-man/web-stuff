import React, { useEffect, useRef } from 'react';
import { useChaos } from '../context/ChaosContext';

interface Props {
  containerId: string;
}

interface ElementPosition {
  element: HTMLElement;
  originalLeft: number;
  originalTop: number;
  originalWidth: number;
  originalHeight: number;
}

const ChaosEffect: React.FC<Props> = ({ containerId }) => {
  const { chaosMode } = useChaos();
  const elementsRef = useRef<ElementPosition[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Find the footer to ensure we don't overlap it
    const footer = document.querySelector('footer');
    let footerTop = window.innerHeight;
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      footerTop = footerRect.top;
      
      // Ensure the footer has a high z-index
      footer.style.position = 'relative';
      footer.style.zIndex = '100';
    }

    // Setup chaos effect
    const setupChaos = () => {
      // Target specific elements that we want to animate
      const targetSelectors = 'p, h1, h2, h3, h4, h5, h6, img, div.my-10, div.mt-8, div.prose > *';
      
      // Get all elements that match our selectors
      const elements = Array.from(container.querySelectorAll(targetSelectors)).filter(el => {
        // Filter out elements that shouldn't be included
        const rect = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        
        // Skip elements that are:
        // 1. Not visible
        // 2. Too small
        // 3. Inside the footer
        // 4. Part of the navbar
        return computedStyle.display !== 'none' && 
               computedStyle.visibility !== 'hidden' && 
               rect.width > 10 && 
               rect.height > 10 &&
               !el.closest('footer') &&
               !el.closest('nav') &&
               rect.top < footerTop - 50; // Stay away from footer
      }) as HTMLElement[];

      // Save original positions and dimensions
      elementsRef.current = elements.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          element: el,
          originalLeft: rect.left,
          originalTop: rect.top,
          originalWidth: rect.width,
          originalHeight: rect.height
        };
      });

      // Apply initial styles to set up for animation
      elementsRef.current.forEach(item => {
        const el = item.element;
        el.style.position = 'fixed';
        el.style.left = `${item.originalLeft}px`;
        el.style.top = `${item.originalTop}px`;
        el.style.width = `${item.originalWidth}px`;
        el.style.height = `${item.originalHeight}px`;
        el.style.zIndex = '20'; // Lower z-index to ensure it doesn't cover footer
        el.style.transition = 'none';
      });

      // Start the chaos animation after a small delay
      setTimeout(() => {
        startChaosAnimation();
      }, 50);
    };

    // Animation function for chaos mode
    const startChaosAnimation = () => {
      // Set transition for smooth animation
      elementsRef.current.forEach(item => {
        const el = item.element;
        el.style.transition = 'all 1.5s cubic-bezier(0.4, 0.0, 1, 1)';
      });

      // Apply random positions within the visible area
      elementsRef.current.forEach(item => {
        const el = item.element;
        
        // Generate random positions
        const viewportWidth = window.innerWidth;
        
        // Calculate safe area that doesn't overlap with footer
        const safeHeight = footerTop - 100; // Keep elements above footer
        
        // Random position within the screen but not overlapping footer
        const randomLeft = Math.random() * (viewportWidth - item.originalWidth);
        const randomTop = Math.min(
          (window.innerHeight / 2) + (Math.random() * (window.innerHeight / 3)),
          safeHeight - item.originalHeight
        );
        
        // Random rotation
        const randomRotation = Math.random() * 360;
        
        // Apply transformation
        el.style.transform = `translate(${randomLeft - item.originalLeft}px, ${randomTop - item.originalTop}px) rotate(${randomRotation}deg)`;
      });
    };

    // Restore elements to their original positions
    const restoreOrder = () => {
      // Reset footer style
      if (footer) {
        footer.style.position = '';
        footer.style.zIndex = '';
      }
      
      // Set transition for smooth restoration
      elementsRef.current.forEach(item => {
        const el = item.element;
        el.style.transition = 'all 0.8s cubic-bezier(0.0, 0.0, 0.2, 1)';
        el.style.transform = 'translate(0, 0) rotate(0deg)';
      });

      // After the animation completes, reset all styles
      setTimeout(() => {
        elementsRef.current.forEach(item => {
          const el = item.element;
          el.style.position = '';
          el.style.left = '';
          el.style.top = '';
          el.style.width = '';
          el.style.height = '';
          el.style.transform = '';
          el.style.transition = '';
          el.style.zIndex = '';
        });
      }, 800); // Match the transition duration
    };

    // Main effect logic
    if (chaosMode) {
      setupChaos();
    } else {
      restoreOrder();
    }

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Safety: Reset all affected elements if component unmounts
      elementsRef.current.forEach(item => {
        const el = item.element;
        el.style.position = '';
        el.style.left = '';
        el.style.top = '';
        el.style.width = '';
        el.style.height = '';
        el.style.transform = '';
        el.style.transition = '';
        el.style.zIndex = '';
      });
      
      // Reset footer
      if (footer) {
        footer.style.position = '';
        footer.style.zIndex = '';
      }
    };
  }, [chaosMode, containerId]);

  return null;
};

export default ChaosEffect; 